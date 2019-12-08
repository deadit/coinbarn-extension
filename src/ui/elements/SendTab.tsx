import {Address, Client, feeValue, minBoxValue} from "@coinbarn/ergo-ts";
import {unitsInOneErgo} from "@coinbarn/ergo-ts/dist/constants";
import React from 'react';
import Account from "../../Account";
import Dropdown from './Dropdown';
import InputBlock from "./InputBlock";
import InputBlockMax from './InputBlockMax';
import {IPopupStatus} from "./Popup";

interface ISendTabProps {
  account: Account
  setPopup(p: IPopupStatus): void
}

interface ISendTabState {
  formValid: boolean
}

export default class SendTab extends React.Component<ISendTabProps, ISendTabState> {

  public tokenDropdownElement: any;
  public addressElement: any;
  public amountElement: any;

  constructor(props) {
    super(props);
    this.state = {
      formValid: false
    };

    this.tokenDropdownElement = React.createRef();
    this.addressElement = React.createRef();
    this.amountElement = React.createRef();
  }

  public currentTokenId(): string {
    if (this.tokenDropdownElement.current) {
      return this.tokenDropdownElement.current.state.currentKey;
    } else {
      return 'ERG'
    }
  }

  public currentTokenName(): string {
    if (this.tokenDropdownElement.current) {
      return this.tokenDropdownElement.current.state.currentValue;
    } else {
      return 'ERG'
    }
  }

  public validateAddress = (address) => {
    const add = new Address(address);
    if (!add.isValid()) {
      return 'Invalid address';
    } else if (!add.isMainnet()) {
      return 'Mainnet address required';
    } else {
      return '';
    }
  };

  public validateAmount = (amount) => {
    const balances = this.props.account.balances();
    const tokenInfo = balances.find(t => t.tokenId === this.currentTokenId());
    if (tokenInfo === undefined) {
      console.log(`TokenId: ${this.currentTokenId()}, balances:${JSON.stringify(balances)}`);
      return 'No such token';
    } else {
      let minValue;
      if (this.currentTokenId() === 'ERG') {
        minValue = minBoxValue / unitsInOneErgo
      } else {
        minValue = Math.pow(10, -tokenInfo.decimals);
      }

      const maxAmount = this.maxAmount();
      if (amount < minValue) {
        return `Minimal amount ot send is ${minValue}`;
      } else if (amount > maxAmount) {
        return `Available balances is ${maxAmount}`;
      } else {
        return '';
      }
    }
  };

  /**
   * Max amount to send for selected token
   */
  public maxAmount(): number {
    const tokenInfo = this.props.account.balances().find(t => t.tokenId === this.currentTokenId());
    if (tokenInfo === undefined) {
      return 0;
    } else if (this.currentTokenId() === 'ERG') {
      return tokenInfo.amount - (feeValue / unitsInOneErgo);
    } else {
      return tokenInfo.amount;
    }
  }

  public onSend = async () => {
    const tokenId = this.currentTokenId();
    const amount = this.amountElement.current.state.value;
    const recipient = this.addressElement.current.state.value;
    const sk = this.props.account.sk;

    const client = new Client();
    const result = await client.transfer(sk, recipient, amount, tokenId);
    if (result.data.id) {
      const tokenName = this.currentTokenName();
      this.props.setPopup(
        {
          show: true,
          title: 'Congrats!',
          line1: `You have successfully send ${amount} ${tokenName} to ${recipient}`,
          line2: `Transaction id is ${result.data.id.replaceAll("^\"|\"$", "")}`
        }
      );
    } else {
      const details = result.data.detail || JSON.stringify(result.data);
      this.props.setPopup(
        {
          show: true,
          title: 'Error!',
          line1: `Transaction send error`,
          line2: details
        }
      );
    }
  };

  public onUpdate = () => {
    const amountIsValid = this.amountElement.current.state.isValid;
    const recipientIsValid = this.addressElement.current.state.isValid;
    const formValid = amountIsValid && recipientIsValid;

    if (this.state.formValid !== formValid) {
      this.setState({formValid: formValid})
    }
  };

  public render() {
    const balances = this.props.account.balances();
    const tokenNames = balances.map(a => a.name);
    const tokenKeys = balances.map(a => a.tokenId);

    return (
      <div className='sendTab'>
        <div className='currencyDiv f2'>
          You send:
          <Dropdown ref={this.tokenDropdownElement} list={tokenNames} keys={tokenKeys}/>
        </div>
        <InputBlock ref={this.addressElement}
                    large={true}
                    name='Address'
                    validate={this.validateAddress}
                    onUpdate={this.onUpdate}/>
        <InputBlockMax ref={this.amountElement}
                       large={true}
                       name='Amount'
                       validate={this.validateAmount}
                       maxValue={this.maxAmount()}
                       onUpdate={this.onUpdate}/>
        <button disabled={!this.state.formValid} className='mediumBtn' onClick={this.onSend}>Send</button>
      </div>
    );
  }
}
