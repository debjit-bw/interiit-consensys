import { ReactNode } from 'react';
import styled from 'styled-components';

type CardProps = {
  content: {
    title?: string;
    coins: Array<any>;
    button?: ReactNode;
  };
  disabled?: boolean;
  fullWidth?: boolean;
};

const CardWrapper = styled.div<{ fullWidth?: boolean; disabled: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '250px')};
  background-color: ${({ theme }) => theme.colors.card.default};
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  padding: 2.4rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.default};
  filter: opacity(${({ disabled }) => (disabled ? '.4' : '1')});
  align-self: stretch;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.6rem;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const Description = styled.div`
  margin-top: 2rem;
`;

const Description2 = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

export const CurrencyCard = ({ content, disabled = false, fullWidth }: CardProps) => {
  const { title, coins, description, description2, select, select2, input, button} = content;
  return (
    <CardWrapper fullWidth={fullWidth} disabled={disabled}>
      {title && (
        <Title>{title}</Title>
      )}
      {coins.map(elem => {
        return (<Description><strong>Coin:</strong> {elem.coin1} <br></br> <strong>Change:</strong> {elem.change}%</Description>)
      })}
      {button}
    </CardWrapper>
  );
};
