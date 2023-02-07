import { OnRpcRequestHandler, OnCronjobHandler } from '@metamask/snap-types';

export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

type Monitor = {
  coin: string;
  change: number;
  current: number;
  time_stamp: number;
};

function getPrice(coin: string) {
  return fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eth&ids=${coin}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
  ).then(function (response) {
    return response.json();
  });
}

type CoinData = Record<string, Monitor[]>;

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  // Coin state. Just a list of all coins to be monitored
  let coin_data: CoinData = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as CoinData;

  if (!coin_data) {
    coin_data = { monitors: [] };
  }

  switch (request.method) {
    case 'check':
      let typed_params: { value1: string; value2: string } = request.params as {
        value1: string;
        value2: string;
      };
      return fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${typed_params.value1}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
      )
        .then(function (response) {
          return response.json();
        })
        .then((fees) => {
          const a = JSON.stringify(fees[0].current_price);

          return fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${typed_params.value2}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
          )
            .then(function (responses) {
              return responses.json();
            })
            .then((fee) => {
              const b = JSON.stringify(fee[0].current_price);
              return wallet.request({
                method: 'snap_confirm',
                params: [
                  {
                    prompt: 'Price conversion',
                    description: 'Real time price',
                    textAreaContent: `1 ${typed_params.value1} = ${
                      parseFloat(a) / parseFloat(b)
                    } ${typed_params.value2}`,
                  },
                ],
              });
            });
        });
    case 'set_vs':
      if (request.params) {
        let typed_params = request.params as Monitor;
        const price = await getPrice(typed_params.coin);

        coin_data.monitors.push({
          coin: typed_params.coin,
          current: price[0].current_price,
          change: typed_params.change,
          time_stamp: typed_params.time_stamp,
        });
        await wallet.request({
          method: 'snap_manageState',
          params: ['update', coin_data],
        });
        return wallet.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: 'Added coin',
              description: `${typed_params.coin} added to be monitored`,
              textAreaContent: `Will notify at ${typed_params.change}%.`,
            },
          ],
        });
      }
      break;
    case 'clear_vs':
      // Method to clear state can be used later to add/delete or clear
      await wallet.request({
        method: 'snap_manageState',
        params: ['clear'],
      });
      break;
    case 'check_vs':
      return coin_data.monitors;
    default:
      throw new Error('Method not found.');
  }
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  let coin_data: CoinData = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as CoinData;
  switch (request.method) {
    case 'check_currency':
      for (let coin of coin_data.monitors) {
        const data = await getPrice(coin.coin);
        const current = data[0].current_price;

        if (((current - coin.current) / coin.current) * 100 >= coin.change) {
          coin_data.monitors = coin_data.monitors.filter(
            (elem) => elem.time_stamp !== coin.time_stamp,
          );
          await wallet.request({
            method: 'snap_manageState',
            params: ['update', coin_data],
          });
          return wallet.request({
            method: 'snap_notify',
            params: [
              {
                type: 'inApp',
                message: `${coin.coin} has reached desired value`,
              },
            ],
          });
        }
      }
      coin_data.monitors.forEach(async (element) => {});
      break;
    default:
      throw new Error('Method not found.');
  }
};
