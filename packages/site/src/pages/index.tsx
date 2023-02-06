import { useContext, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendHello,
  sendCheck,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  SendChecks,
  Card,
  FormDetail,
  Dropdown,
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

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

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
      await sendHello();
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

    {label: 'Ethereum', value: 'ethereum'},
    {label: 'USDC', value: 'usd-coin'},
    {label: 'USDT', value: 'tether'},
    {label: 'Wrapped Ether', value: 'weth'}
 
  ];
  const eth = [{label: 'USDC', value1: 'usd-coin'}, {label: 'USDT', value1: 'tether'}, {label: 'Wrapped Ether', value1: 'weth'}]
  const usdc = [{label: 'Ethereum', value1: 'ethereum'}, {label: 'USDT', value1: 'tether'}, {label: 'Wrapped Ether', value1: 'weth'}]
  const usdt = [{label: 'Ethereum', value1: 'ethereum'}, {label: 'USDC', value1: 'usd-coin'}, {label: 'Wrapped Ether', value1: 'weth'}]
  const weth = [{label: 'Ethereum', value1: 'ethereum'}, {label: 'USDC', value1: 'usd-coin'}, {label: 'USDT', value1: 'tether'}]
  
  const [type, setType] = useState(eth);
  const [value, setValue] = useState('ethereum');
  const [value1, setValue1] = useState('usd-coin');
  let option = null;
  const handleChange = (event) => {
    setValue(event.target.value);
    if (event.target.value === "ethereum") {
      setType(eth)
    }
    else if (event.target.value === 'usd-coin') {
      setType(usdc)
    } else if (event.target.value === "tether") {
      setType(usdt)
    } else if (event.target.value === "weth") {
      setType(weth)
    }
  };

  const handleChange1 = (events) => {
    setValue1(events.target.value);
  }

  return (
    <Container>
      <Heading>
        Welcome to <Span>profile snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle>
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
                'Get started by connecting to and installing the example snap.',
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
        <Card
          content={{
            title: 'Send Hello message',
            description:
              'Display a custom message within a confirmation screen in MetaMask.',
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
            description :
              'From',
            select: (<div>
              <label>         
                <select value={value} onChange={handleChange}>
                  {options.map((option) => (
                    <option value={option.value} key={option.label}>{option.label}</option>
                  ))}
                </select>
                <p>{value}</p>
              </label>         
            </div>
            ),
            description2 :
              'To',
            select2: (<div>
              <label>         
                <select value={value1} onChange={handleChange1}>
                  {type.map((opt) => (
                    <option value={opt.value1} key={opt.label}>{opt.label}</option>
                  ))}
                </select>
                <p>{value1}</p>
              </label>         
            </div>
            ),
            input: (
              <Dropdown />
            ),
            button: (<SendChecks 
              onClick={handlePriceCheck}
            />)
          }}
        />
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
