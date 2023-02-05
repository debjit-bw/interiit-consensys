import { OnRpcRequestHandler } from '@metamask/snap-types';

async function getRate(value, value1) {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${value}&order=market_cap_desc&per_page=100&page=1&sparkline=false`); 
  const response1 = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${value1}&order=market_cap_desc&per_page=100&page=1&sparkline=false`); 
  return [response.json(), response1.json()]
} 

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

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
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'check':
      return getRate(request.params.val, request.params.val1).then(fees => {
        return wallet.request({
          method: 'snap_confirm', 
          params: [
            {
              prompt: getMessage(origin),
              description:
                'This custom confirmation is just for display purposes.',
              textAreaContent:
                `Current fee estimates: ${fees[0][0].current_price}`,
            }
          ]
        }); 
      }); 
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Hello!',
            description:
              'This ',
            textAreaContent:
              '12',
          },
        ],
      });
    default:
      throw new Error('Method .');
  }
};
