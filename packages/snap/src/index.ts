import { OnRpcRequestHandler, OnCronjobHandler } from '@metamask/snap-types';

export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

// TODO: Need to add another field for the condition
type Monitor = {
  coin1: string;
  change: number;
  current: number;
  time_stamp: number;
};

function getPrice(coin: string) {
  return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=eth&ids=${coin}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
    .then(function (response) {
      return response.json();
    })
}

type CoinData = Record<string, Monitor[]>

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {

  // Coin state. Just a list of all coins to be monitored
  let coin_data: CoinData = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  }) as CoinData;

  if (!coin_data) {
    coin_data = { monitors: [] };
  }

  switch (request.method) {
    case 'check':

      return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${request.params.val}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
        .then(function (response) {
          return response.json();
        })
        .then(fees => {
          const a = JSON.stringify(fees[0].current_price);

          return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${request.params.val1}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
            .then(function (responses) {
              return responses.json();
            })
            .then(fee => {
              const b = JSON.stringify(fee[0].current_price);
              return wallet.request({
                method: 'snap_confirm',
                params: [
                  {
                    prompt: "Price conversion",
                    description:
                      'Real time price',
                    textAreaContent:
                      `1 ${request.params.val} = ${(parseFloat(a) / (parseFloat(b)))} ${request.params.val1}`,
                  }
                ]
              });
            });
        });
    case 'set_vs':
      // Use this method to add 2 currencies to the list of monitored currencies
      if (request.params) {
        const price = await getPrice(request.params.coin1);

        coin_data.monitors.push({ coin1: request.params.coin1, current: price[0].current_price, change: request.params.change, time_stamp: request.params.time_stamp });
        await wallet.request({
          method: 'snap_manageState',
          params: ['update', coin_data],
        });
        return wallet.request({
          method: "snap_confirm",
          params: [
            {
              prompt: 'Added coin',
              description:
                `${request.params.coin1} added to be monitored`,
              textAreaContent:
                `Will notify at ${request.params.change}%.`,
            }
          ]
        })
      }
      break;
    case 'clear_vs':
      // Method to clear state can be used later to add/delete or clear
      await wallet.request({
        method: "snap_manageState",
        params: ['clear']
      });
      break;
    case 'check_vs':
      return coin_data.monitors;
    default:
      throw new Error('Method not found.');
  }
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  let coin_data: CoinData = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  }) as CoinData;
  switch (request.method) {
    case 'check_currency':
      for (let coin of coin_data.monitors) {
        const data = await getPrice(coin.coin1);
        const current = data[0].current_price;
        if (((current - coin.current) / (coin.current)) * 100 >= coin.change) {
          coin_data.monitors = coin_data.monitors.filter(elem => elem.time_stamp !== coin.time_stamp)
          await wallet.request({
            method: "snap_manageState",
            params: ['update', coin_data]
          })
          return wallet.request({
            // Can be changed to a snap confirm if it needs to be more noticable
            method: 'snap_notify',
            params: [
              {
                type: "inApp",
                message: `${coin.coin1} has reached desired value`,
              },
            ],
          });
        }
      }
      coin_data.monitors.forEach(async (element) => {
      });
      break;
    default:
      throw new Error('Method .');
  }
};
