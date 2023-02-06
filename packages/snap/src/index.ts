import { OnRpcRequestHandler, OnCronjobHandler } from '@metamask/snap-types';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

// TODO: Need to add another field for the condition
type Monitor = {
  coin1: string;
  coin2: string;
};

type CoinData = Record<string,Monitor[]>

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
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
    coin_data = {monitors: []};
  }

  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'inApp',
            message: `Hello, world!`,
          },
        ],
      });
    case 'set_vs':
      // Use this method to add 2 currencies to the list of monitored currencies
      if (request.params){
        coin_data.monitors.push(request.params as Monitor);
        await wallet.request({
          method: 'snap_manageState',
          params: ['update', coin_data],
        });
        // Confirming just to check. Can be modified to not show a notification.
        return wallet.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: `Hello, ${origin}!`,
              description: 'The address has been saved to your address book',
              textAreaContent: `${JSON.stringify(coin_data.monitors)}`
            },
          ],
        });
      } 
      break;
    case 'clear_vs':
      // Method to clear state can be used later to add/delete or clear
      await wallet.request({
        method: "sanp_manageState",
        params: ['clear']
      });
      break;
    default:
      throw new Error('Method not found.');
  }
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case 'exampleMethodOne':
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'inApp',
            message: `Hello, world!`,
          },
        ],
      });
    case 'test_chron':
      const state = false;
      if (state) {
        return wallet.request({
          // Can be changed to a snap confirm if it needs to be more noticable
          method: 'snap_notify',
          params: [
            {
              type: 'inApp',
              message: `Hello Your Token is ready`,
            },
          ],
        });
      }
      break;
    default:
      throw new Error('Method not found.');
  }
};
