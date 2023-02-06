import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_enable',
    params: [
      {
        wallet_snap: {
          [snapId]: {
            ...params,
          },
        },
      },
    ],
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'hello',
      },
    ],
  });
};


export const sendCheck = async (value, value1) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'check',
        params: {
          val: value,
          val1 : value1
        }
      }
    ],
  });
};

/**
 * Invoke the "set_vs" method from the example snap.
 * Will add the 2 coins to the coin data in the snap.
 * coin_data will be used to call the methods 
 */

export const setVs = async (coin1:string, coin2:string) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'set_vs',
        params: {
          coin1:coin1,
          coin2:coin2,
        }
      },
    ],
  });
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
