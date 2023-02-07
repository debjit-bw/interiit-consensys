import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendHello,
  sendCheck,
  setVs,
  shouldDisplayReconnectButton,
  sendClear,
  getVs,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  SendAddButton,
  SendChecks,
  Card,
  FormDetail,
  Dropdown,
  CurrencyCard,
} from '../components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Selector = styled.select`
  border-radius: 7px;
  height: 30px;
  margin-top: 5px;
  width: 100%;
  font: 
  &:hover{
    background-color: black;
    color: white;
  }
`;

const format_coin = (data: any[]) => {
  let str = '';
  for (let coin of data) {
    str += `Coin: ${coin.coin1}
    
    Change: ${coin.change}%`;
  }
  return str;
};

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const [monitoredCurr, setMonitoredCurr] = useState([]);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendClear();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handlePriceCheck = async () => {
    try {
      await sendCheck(value, value1);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const options = [
    { label: 'Ethereum', value: 'ethereum' },
    { label: 'USDC', value: 'usd-coin' },
    { label: 'USDT', value: 'tether' },
    { label: 'Wrapped Ether', value: 'weth' },
  ];

  const options1 = [
    { label: 'Ethereum', value: 'ethereum' },
    { label: 'USDC', value: 'usd-coin' },
    { label: 'USDT', value: 'tether' },
    { label: 'Wrapped Ether', value: 'weth' },
  ];

  const eth = [
    { label: 'USDC', value1: 'usd-coin' },
    { label: 'USDT', value1: 'tether' },
    { label: 'Wrapped Ether', value1: 'weth' },
  ];
  const usdc = [
    { label: 'Ethereum', value1: 'ethereum' },
    { label: 'USDT', value1: 'tether' },
    { label: 'Wrapped Ether', value1: 'weth' },
  ];
  const usdt = [
    { label: 'Ethereum', value1: 'ethereum' },
    { label: 'USDC', value1: 'usd-coin' },
    { label: 'Wrapped Ether', value1: 'weth' },
  ];
  const weth = [
    { label: 'Ethereum', value1: 'ethereum' },
    { label: 'USDC', value1: 'usd-coin' },
    { label: 'USDT', value1: 'tether' },
  ];

  const [type, setType] = useState(eth);
  const [value, setValue] = useState('ethereum');
  const [value2, setValue2] = useState('ethereum');
  const [value1, setValue1] = useState('usd-coin');
  const [input, setInput] = useState(0);
  
  const handleChange = (event: any) => {
    setValue(event.target.value);
    if (event.target.value === 'ethereum') {
      setType(eth);
      setValue1('usd-coin');
    } else if (event.target.value === 'usd-coin') {
      setType(usdc);
      setValue1('ethereum');
    } else if (event.target.value === 'tether') {
      setType(usdt);
      setValue1('ethereum');
    } else if (event.target.value === 'weth') {
      setType(weth);
      setValue1('ethereum');
    }
  };

  const handleSendVsClick = async () => {
    try {
      // Checking with dummy values
      await setVs(value2, input);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  useEffect(() => {
    try {
      if (state.installedSnap) {
        getVs().then((data) => {
          setMonitoredCurr(data as never[]);
        });
      }
    } catch (e) {}
  }, [handleSendHelloClick, handleSendVsClick, state.installedSnap]);

  const handleChange1 = (events: any) => {
    setValue1(events.target.value);
  };
  const handleChange2 = (events: any) => {
    setValue2(events.target.value);
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>TradeX</Span>
      </Heading>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the TradeX snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}

        <CurrencyCard
          content={{
            title: 'Monitored Coins',
            coins: monitoredCurr,
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Check Price conversion',
            description: 'From',
            select: (
              <div>
                <label>
                  <Selector value={value} onChange={handleChange}>
                    {options.map((option) => (
                      <option value={option.value} key={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </Selector>
                  <p>{value}</p>
                </label>
              </div>
            ),
            description2: 'To',
            select2: (
              <div>
                <label>
                  <Selector value={value1} onChange={handleChange1}>
                    {type.map((opt) => (
                      <option value={opt.value1} key={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </Selector>
                  <p>{value1}</p>
                </label>
              </div>
            ),
            input: <Dropdown />,
            button: <SendChecks onClick={handlePriceCheck} />,
          }}
          disabled={!state.installedSnap}
        />
        <Card
          content={{
            title: 'Set Reminder for Change',
            description: 'Choose coin to store',
            select: (
              <div>
                <label>
                  <Selector value={value2} onChange={handleChange2}>
                    {options1.map((option) => (
                      <option value={option.value} key={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </Selector>
                  <p>{value2}</p>
                </label>
              </div>
            ),
            description2: 'Change margin (in %)',
            input: (
              <>
                <FormDetail
                  placeholder={'Select percentage'}
                  onInput={(e: any) => setInput(e.target.value)}
                />
                <p>{input}</p>
              </>
            ),
            button: <SendAddButton onClick={handleSendVsClick} />,
          }}
          disabled={!state.installedSnap}
        />
      </CardContainer>
    </Container>
  );
};

// This is a function to add the coin to the snap persistent state

export default Index;
