<h1>Continuous Organizations</h1>

A _Continuous Organization_ refers to any organization that set up a _Continuous Token Offering_ to give to every stakeholder the ability to invest in the organization at any single time.

<h4 id="cso">Continuous Token Offering (CTO)</h4>

A _Continuous Token Offering_ (_CTO_) is a novel way for organizations to receive financing without releasing any equity or any governance rights. A CTO uses an organization's realized revenues (i.e. revenues for which a payment has been made) as a collateral to back fully digital assets that anyone can buy or sell to speculate on the organization's future revenues.

To create a _Continuous Token Offering_, an organization would agree to build a collateral of value using a fixed percentage of its realized revenues during a pre-defined minimum period of time. This is done concretely by funneling the said fixed percentage of revenues into a _Decentralized Autonomous Trust_ (_DAT_). A _DAT_ is a smart-contract that automatically issues and buy back _CTO Tokens_ to meet market demand from investors using a token [bonding curve contract](https://medium.com/@justingoro/token-bonding-curves-explained-7a9332198e0e) with [sponsored burning](https://medium.com/@avsa/sponsored-burning-for-tcr-c0ab08eef9d4).

**Important note about the currency used to interact with a DAT**

In the following examples, we are using ETH (the currency of the Ethereum blockchain) as the currency to interact with the DAT. ETH is the native currency for an Ethereum-based DAT. It does not mean that end users (individuals and organizations) will necessarily have to manipulate ETH to interact with DATs. First, ETH can be replaced by a stablecoin (like [DAI](https://makerdao.com/dai/) or [USDC](https://www.centre.io/usdc)) to remove the volatility associated with ETH.

<h4 id="bondingcurve">Understanding the token bonding curve model</h4>

Many individuals have explored [the](https://blog.oceanprotocol.com/introducing-the-equilibrium-bonding-market-e7db528e0eff) [bonding](https://tokeneconomy.co/token-bonding-curves-in-practice-3eb904720cb8) [curve](https://medium.com/@hayeah/code-analysis-of-fomo3d-pricing-and-dividends-6fb267bbf3a7) [model](https://medium.com/thoughtchains/on-single-bonding-curves-for-continuous-token-models-a167f5ffef89) since [Simon De La Rouvière](https://twitter.com/simondlr) first came up with [the idea](https://medium.com/@simondlr/tokens-2-0-curved-token-bonding-in-curation-markets-1764a2e0bee5) in 2017.

A _bonding curve contract_ is a specific type of smart-contract that issues its own tokens through **B**uy and **S**ell functions. To buy tokens, the buyer sends ETH to the Buy function which calculates the average price of the token in ETH and issues you the correct amount. The Sell function works in reverse: The contract will calculate the current average selling price and will send you the correct amount of ETH (excerpt taken from [Token Bonding Curves Explained](https://medium.com/@justingoro/token-bonding-curves-explained-7a9332198e0e)).

In the case of _Continuous Organizations_, the Buy and Sell functions are distinct:

<img src="embed/Introducing-Continuous0.png" width="580" title="The Bonding Curves of a Continuous Organization" alt="The Bonding Curves of a Continuous Organization" />

A token bonding curve model has interesting properties, including:

*   **Limitless supply**. There is no limit to the number of tokens that can be minted.
*   **Deterministic price calculation**. The buy and sell prices of tokens increase and decrease with the number of tokens minted.
*   **Guaranteed and immediate liquidity**. The bonding curve contract is the counterparty of the transaction and always holds enough ETH in reserve to buy tokens back. So tokens can be bought or sold instantaneously at any time, the bonding curve acting as an automated market maker.
*   **Continuous price**. The price of token n being inferior to the token n+1 and superior to the token n-1, calculating the number of tokens minted for a given amount of ETH (or the number of ETH sent back for a given amount tokens) requires some integral calculus.

It is important to note that in a bonding curve model, the x-axis represents the **number of tokens issued**. To give a simple example, let's say `B(x)=x` and `S(x)=0`. The cost `C` to buy the first 10 tokens is given by the surface between the buy curve and the sell curve that can be expressed as the following integral:

<img src="https://latex.codecogs.com/gif.latex?\int_{0}^{x}(B(x)-S(x))dx" title="Cost C to buy the 1st 10 tokens" />.

<img src="embed/Introducing-Continuous1.png" width="300" title="Cost C to buy the 1st 10 tokens" alt="Cost C to buy the 1st 10 tokens" />

So, in our example: `C=10*10/2=50`.

<h4 id="dat">The Decentralized Autonomous Trust</h4>

In the case of _Continuous Organizations_, we introduce the _revenue-based bonding curve_: a bonding curve that uses 2 different functions, one for the buy curve and another for the sell curve: **B** (for **b**uy) and **S** (for **s**ell) with <img src="https://latex.codecogs.com/gif.latex?B(x)>S(x)&space;\forall&space;x&space;\in&space;[0;\infty[" />.

<img src="embed/Introducing-Continuous2.png" width="580" title="Buy and Sell curves" alt="Buy and Sell curves" />

The bonding curve contract of a _Decentralized Autonomous Trust_ issues _COT Securities_ (_COTs_). These _COTs_ represent a claim on the _DAT_'s cash reserve. It is important to note that, unlike a stock, a _COT_ does not represent a claim on the organization's ownership, it only carries a financial right to the cash reserve managed by the _DAT_. And the _DAT_'s cash reserve is a function of the organization's revenues. So, by buying _COTs_, an investor gets a financial exposure on the organization's future revenues.

The function _B_ defines the price at which _COTs_ can be bought from the _DAT_. _B_ is a linear function and has a positive slope **_b_** such that `B(x)=b*x` where <img src="https://latex.codecogs.com/gif.latex?b\in&space;R" /> and `b>0`. The slope _b_ can be chosen arbitrarily. The higher _b_ is, the more value unit tokens will have, and vice-versa, as the lower _b_ is, the less value unit tokens will have.

If you want your investors to have a lot of tokens, pick a very small value for b (like 1x10^(-9)). It has no financial impact, simply allowing more granularity for fractional rights.

The function _S_ defines the price at which _COTs_ are bought back by the _DAT_. _S_ is a linear function as well and has a slope **_s_** such that `S(x)=s*x` where <img src="https://latex.codecogs.com/gif.latex?s\in&space;R" /> and `s>0`. However, in a _Continuous Organization,_ the value of _s_ changes over time. To explain how the value of _s_ changes over time, it is important to understand how a _DAT_ receives and processes the cash it receives.

<h5 id="buy">📈 Investments - buy()</h5>

The first (in "time", not in "proportion") source of cash-flows for a _DAT_ are investors who want to invest in the _Continuous Organization_. They do that by calling the `buy()` function of the _DAT_. Whenever an "external" investor (as opposed to the organization itself) sends funds to the _DAT_, a fraction of the funds sent is being held in the cash reserve by the _DAT_ and the rest of the funds are being transferred to the organization's wallet. We'll call **I** (for **i**nvest) the percentage of the funds being held in the cash reserve. **I** is a constant.

_Value flow when an investment occurs_

<img src="embed/Introducing-Continuous4.png" width="300" title="Investments - Buy - Impact on bonding curve" alt="Investments - Buy - Impact on bonding curve" />

_Impact on the Bonding Curve Contract of the DAT when an investment occurs_

The investors buying _COTs_ are doing so to invest money in the underlying organization. Investors don't want their money to be held in reserve by the _DAT_, they want their money to be put to good use by the organization. Consequently, the value of _s_ must be an order of magnitude lower than _b_, which means that **I** should ideally be low. **I** could also be `0` if the organization's characteristics (revenues, growth...) can justify it.

_Example_: Let's say that an investor sends 10 ETH to the _DAT_, if I=10% then the _DAT_ will transfer 9 ETH to the organization's wallet and will keep 1 ETH in its cash reserve.

The rules described above do not apply if the investor is the beneficiary organization, that is, if the organization is technically _investing in itself_. In that case, **I** is always equal to `100%`. It means that whenever an organization is investing in its _DAT_, 100% of the amount invested by the organization to buy _COTs_ goes to the buy-back reserve. For more information, see the <a href="#fairpurchase"><i>COTs purchase by the beneficiary organization</i></a> section below.

<h6>Calculus</h6>

When an investor buys _COTs_ for a cost `c`, he receives `x` _COTs_, with `x` being equal to:

<img src="https://latex.codecogs.com/gif.latex?x=\sqrt{\frac{2c}{b}+a^2}-a" title="Number of COTs acquired for a cost c" /> (see proof in <a href="#annex">Annex</a>)

with `c` the amount used to buy _COTs_, `b` the sell slope and `a` the number of _COTs_ already in circulation before the transaction.

<h5 id="fairpurchase">🏢 COTs purchase by the beneficiary organization - buy()</h5>

At any time, the beneficiary organization can decide to buy _COTs_. To do that, the beneficiary organization calls the `buy()` function like any other investor, however, unlike external investors, the funds sent by the beneficiary organization to purchase _COTs_ are 100% funneled to the buyback reserve (i.e the contribution ratio `I` is equal to 100% when funds come from the beneficiary organization).

This guarantees a total alignment of interests between all investors. Indeed, if the beneficiary organization was able to buy _COTs_ with the same investment ratio I than external investors, it would concretely mean that the beneficiary organization is able to buy _COTs_ for a fraction of the price compared to external investors (because the organization receives by definition `(1-I)%` of the amount invested). This difference could easily be abused by dishonest organizations and managers.

Purchasing _COTs_ is also how the organization can reward _COTs_ holders. Indeed, when the beneficiary organization buys _COTs_, not only does it increase the buy-back reserve, it also increases the slope of the selling curve (see detailed explanation below).

As a consequence, in the case of an organization with off-chain revenues, buying _COTs_ is how the organization actually funnels its revenues to the _DAT_. That means that, the more revenues the organization generates, the more _COTs_ it accrues over time and can use to further incentivize its key stakeholders. Of course, the organization can also simply decide to `burn()` its _COTs_ if it wants to maximize the reward to _COT_ holders.

<img src="embed/CO-token-buyback.PNG" width="380" title="COTs purchase flow" alt="COTs purchase flow" />

_Value flow when the beneficiary organization purchases COTs_

<img src="embed/CO-token-buyback-curve.png" width="350" title="COTs purchase impact" alt="COTs purchase impact" />

_Impact on the Bonding Curve when the beneficiary organization purchases COTs_

The difference between an investment by an external investor and a _COTs_ purchase by the beneficiary organization is their respective _contribution ratio_ to the _DAT_'s reserve:

1.  **investment by external investor**: an amount M contributes `I*M` to the _DAT_'s reserve while minting the value equivalent of M, thus a contribution ratio of `(I*M)/M=I` and by construction I<<100%
2.  **COTs purchase by beneficiary organization**: an amount M contributes `M` to the _DAT_'s reserve while minting the value equivalent of `M`, thus a contribution ratio of `M/M=100%`

After each transaction, _s_ can be recalculated from the amount in reserve R<sub>t</sub>:

<img src="https://latex.codecogs.com/gif.latex?R_{t}=\int_{0}^{x}S_{t}(x)dx=\int_{0}^{x}s_{t}xdx=\frac{s_{t}x^{2}}{2}" />

so 

<img src="https://latex.codecogs.com/gif.latex?s_{t}=\frac{2R_{t}}{x^{2}}=\frac{2R}{\frac{2d}{b}+a^{2}}" /> &nbsp;&nbsp;_(see proof in <a href="#annex">Annex</a>)_ 

_Example_: Say I=10%,s<sub>0</sub>=0.1 and b=1. Assume an investor buys the first 10 tokens for 50 ETH, so the _DAT_ now has 50x10%=5 ETH in reserve. Then, the beneficiary organization buys _COTs_ for 1 ETH of value. This 1 ETH is used to mint 0.0995 tokens (we'll leave this as an exercise for the reader. Hint: the equation to solve is <img src="https://latex.codecogs.com/gif.latex?x^{2}+20x-2=0" />), which gives s<sub>1</sub>=0.1176. So, the operation increased value for _COTs_ holders as s<sub>1</sub>>s<sub>0</sub>, that is, they can now sell their _COTs_ at a higher value than before.

<h5 id="burn">🔥 Burning COTs - burn()</h5>

A _COTs_ holder can at anytime take the decision to burn its _COTs_ by calling the `burn()` function.

Burning _COTs_ does not technically destroys them (the total supply of _COTs_, including burnt _COTs_ remains the same) but it makes sure that no one will ever be able to use them so that their marginal value can be redistributed equally to other _COT_ holders.

It makes little sense for an investor to do so with its _COTs_, but it does make sense for the beneficiary organization to be able to burn its _COTs_ (1) if it has no use of them or (2) if it wants to increase the value of all other _COTs_.

Indeed, when a _COT_ is burnt, its lowest possible value is equally redistributed to all _COTs_ holders so that, when an investor sells its _COTs_, he receives a fraction of the cash reserve + a pro-rata of the value locked in burnt _COTs_. See <a href="#sell">sell()</a> section below for the exact calculus.

The direct consequence of this is that there is never value locked forever in the cash reserve: selling 100% of the non-burnt _COTs_ will deplete the cash reserve from 100% of its value.

<img src="embed/CO-burn-impact.png" width="350" title="COTs burn impact" alt="COTs burn impact" />

_Representation of the impact of burning COTs on the Bonding Curve_

<h5 id="sell">💰 Investments - sell()</h5>

Investors can at any time decide to sell their COTs to get ETH back. They do that by calling the `sell()` function of the _DAT_. When the _DAT_ receives _COTs_, it burns the received _COTs_ and sends ETH back to the selling investor according to a function **S** (for **s**ell). _S_ has a slope _s_ that increases discretely over time, every time the _DAT_ receives a payment. The ETH sent back to the investor is taken from the _DAT_ "buyback" cash reserve and does **not** affect the organization's treasury.


<img src="embed/Introducing-Continuous5.png" width="580" title="Investments - Sell" alt="Investments - Sell" />

_Value flow when a COT sale occurs_

<img src="embed/Introducing-Continuous6.png" width="300" title="Investments - Sell - Impact on bonding curve" alt="Investments - Sell - Impact on bonding curve" />

_Impact on the Bonding Curve Contract of the DAT when an investor sells its tokens_

<h6>calculus</h6>

When an investor sells `x` _COTs_, assuming no _COTs_ were previously burnt, he receives an amount `c`, with `c` being equal to:

<img src="https://latex.codecogs.com/gif.latex?c=axs-\frac{x^2s}{2}" title="amount perceived when selling x COTs (without burnt COTs)" /> (see proof in <a href="#annex">Annex</a>)

with `s` the sell slope and `a` the number of _COTs_ in circulation before the transaction.

In the case _COTs_ were burnt (see <a href="#burn">previous section</a>), the calculus becomes:

<img src="https://latex.codecogs.com/gif.latex?c=axs-\frac{x^2s}{2}+\frac{sxx'^2}{2(a-x')}" title="amount perceived when selling x COTs" />

where `x'` is the number of burnt _COTs_.

<h5 id="pay">💲 Revenues - pay()</h5>

A _Continuous Organization_ has the *option* to perceive its customer's payments directly through the _DAT_ by calling its `pay()` function.

Whenever the _DAT_ receives a payment **P**, a fraction of the payment received is being funneled into the cash reserve. We'll call **D** (for **D**istribution) the percentage of the revenues being funneled into the cash reserve and **d** the corresponding fraction of the revenues (d=P*D). The entire amount `d` is saved in the _DAT_'s cash reserve, thus increasing the value of _COTs_.

It is important to note that calling `pay()` will also trigger the issuance of new _COTs_. The number of _COTs_ issued is equivalent to the number of _COTs_ that would be created if `buy(d)` was called. By default, these newly minted _COTs_ are sent to the organization like showed on the following graph:

<img src="embed/customer-pays-org.png" width="580" title="pay() function value flow" alt="pay() function value flow" />

_Value flow when the CO relies on the DAT to receive its payments_

Optionally, the customer can specify a parameter of the `pay()` function to sent the newly minted _COTs_ to an address of his choice (most likely the address of his wallet) in which case the value flow would look like this:

<img src="embed/customer-pays-to.png" width="580" title="pay() function value flow" alt="pay() function value flow" />

_Value flow when the customer specifies his wallet address to pay()_

_Example_: Suppose D=5%, if the _Continuous Organization_ receives a payment of 100 ETH, 5 ETH will be funneled to the "buyback" cash reserve, increasing the collective value of _COTs_.

_Note_: For some _Continuous Organizations_ (_COs_ with no underlying legal entity, for example), it can make sense to receive their customers' payments (i.e. the _CO_'s revenues) directly through the _DAT_. It is important to note that it is not mandatory for the organization's revenues to funnel through the _DAT_ as the organization can also decide to _only_ reward _COTs_ holders through _COTs_ purchase.

For organizations that already have a running business, they will very likely prefer to _first_ receive a payment from their customer in fiat (as they usually do, without changing their selling process) and will _then_ purchase _COTs_ to transfer a fraction of their perceived revenues to the _DAT_ to increase the _COTs_ value, as illustrated here:

<img src="embed/buy-offchain-revenues.png" width="400" title="Revenues for real organizations" alt="Revenues for real organizations" />

This way, the _DAT_ is made completely invisible for the customer (no change in UX) and the organization does **not** have to modify any of its highly optimized selling processes.

<h5 id="pre-mint">🍯Pre-minted COT pool</h5>

When the _DAT_ is being created (and **only** then because once created the _DAT_ becomes immutable), the organization can decide to "pre-mint" for itself and for free a number **PM** of _COTs_. That means that, instead of having the supply of _COTs_ of the _DAT_ start from zero, it would start from PM.

Pre-minting COTs can often make a lot of sense to the organization, be it to reward its founders, to pay its early employees, to reward its early users or to secure a liquidity pool for the secondary market.

However, it is very important to realize that pre-creating COTs comes with a potentially high cost, as these "free" pre-minted _COTs_ represent a selling pressure on the _DAT_ as they are _COTs_ that got allocated "for free", without any contribution to the _DAT_ "buyback" cash reserve.

Technically speaking, it means that the greater the number of COT tokens that are pre-minted, the lower the sell curve will be (i.e., the _s_ slope defined previously). So concretely, if an organization decides to pre-mint a large number of COTs when setting up the DAT, it may want to be very careful not to pre-mint too many of them because it could have a significant negative impact on the risk and financial reward of investors.

<img src="embed/Introducing-Continuous10.png" width="300" title="Pre-minted COT pool" alt="Pre-minted COT pool" />

_Impact of pre-minted tokens, everything else being equal_

 So, as an organization, you might have good reasons to pre-mint some _COTs_ but beware because pre-minting too much will make your _COTs_ become less attractive for investors. A good rule here is to only pre-mint the _COTs_ needed before generating revenues. Once revenues starts rolling in, the organization will accrue _COTs_ naturally, through the funneling of its revenues to the _DAT_.


<h5 id="summary">📄 Summary</h5>


A _Continuous Organization_ is an organization that issues _COT_ through a _Continuous Token Offering_ by funneling part or all of its realized revenues to a specific type of smart-contract called _Decentralized Autonomous Trust_ (_DAT_). These _COT_ represent a claim on the _DAT_'s present and future cash reserve and allow investors to speculate on the revenue growth of the organization. The organization, its investors and, potentially, its customers interact with the _DAT_ by sending ETH or _COTs_ to it:

<table>
  <tr>
   <td>Source of cash-flow
   </td>
   <td>What happens at the <em>DAT</em>?
   </td>
  </tr>
  <tr>
   <td>
       <img src="embed/Introducing-Continuous11.png" width="250" alt="Investment (buy)" title="Investment (buy)">
       <p style="text-align:center;"><em>Investment (buy)</em></p>
   </td>
   <td>
       ▪ The <em>DAT</em> receives ETH from the buying investor<br/>
       ▪ The <em>DAT</em> mints new <em>COTs</em> and send them to the buying investor.<br/>
       ▪ The sum invested is in part distributed to the beneficiary organization and in part saved in the <em>DAT</em> cash reserve according to a pre-defined immutable function <strong>I</strong> (for <strong>i<em>nvestment</em></strong>).
   </td>
  </tr>
  <tr>
   <td>
       <img src="embed/fair-purchase.png" width="350" alt="COTs purchase" title="COTs purchase">
       <p style="text-align:center;"><em>COT purchase (buy)</em></p>
   </td>
   <td>
       ▪ the <em>DAT</em> receives ETH **from the beneficiary organization**<br/>
       ▪ the <em>DAT</em> uses the funds to mint new <em>COT</em>s and sends them back to the beneficiary organization.<br/>
       ▪ The funds used to mint the <em>COT</em>s are entirely funneled in the <em>DAT</em> cash reserve.
   </td>
  </tr>
  <tr>
   <td>
       <img src="embed/fair-burn.PNG" width="250" alt="COT burn (burn)" title="COT burn (burn)">
       <p style="text-align:center;"><em>COT burn (burn)</em></p>
   </td>
   <td>
       ▪ The <em>DAT</em> receives COTs<br/>
       ▪ The <em>DAT</em> destroys the received <em>COT</em>s<br/>
       ▪ The lowest value of the burnt <em>COT</em>s is being reaffected equally to all <em>COTs</em> holders via the `sell()` function.
   </td>
  </tr>
  <tr>
   <td>
       <img src="embed/Introducing-Continuous12.png" width="250" alt="Investment (sell)" title="Investment (sell)">
       <p style="text-align:center;"><em>Investment (sell)</em></p>
   </td>
   <td>
       ▪ The <em>DAT</em> receives COT from the selling investor<br/>
       ▪ The <em>DAT</em> burns the received <em>COT</em>s and sends ETH back to the selling investor according to a function <strong>S</strong> (for <strong>s</strong>ell). <em>S</em> has a slope <em>s</em> that increases discretely over time, every time the <em>DAT</em> receives a payment.<br/>
       ▪ The ETH sent back to the investor is taken from the <em>DAT</em> cash reserve and does <strong>not</strong> affect the organization's treasury.
   </td>
  </tr>
  <tr>
   <td>
       <img src="embed/Introducing-Continuous14.png" width="250" alt="Revenues" title="Revenues">
       <p style="text-align:center;"><em>Revenues (pay)</em></p>
   </td>
   <td>
       ▪ The <em>DAT</em> receives a payment from a customer.<br/>
       ▪ The <em>DAT</em> transfers the revenues to the organization but retains a fraction <strong>D</strong> (for <strong>d<em>istribution</em></strong>) of the revenues that are funneled to the cash reserve, issuing new <em>COTs</em>.<br/>
       ▪ The organization (or optionally the customer) receives the newly minted <em>COTs</em>.<br/>
   </td>
  </tr>
</table>

Finally, a _DAT_ can be created with pre-minted COTs for the organization that can then distribute them freely to stakeholders. However, it is important to note that these pre-minted COTs come at a cost as they are directly diluting future investors.

<h4 id="lifecycle">Lifecycle of a Continuous Token Offering</h4>

<h5 id="initialization">Initialization</h5>

The initialization phase of a _CTO_ is specific in that it does not use the bonding curve. Indeed, to kickoff a _CTO_, the beneficiary organization needs to set an minimal funding goal (_MFG_). This _MFG_ is the amount of investment required for the bonding curve to start. All investors investing before the _MFG_ is reached (using the `buy()` function) receive _COTs_ at the same average price.

<img src="embed/initialization-mfg.png" width="300" title="Initialization phase" alt="Initialization phase" />

_Initialization phase of a Continuous Token Offering_

Until the _MFG_ is reached, all funds are escrowed and investors can decide to withdraw their investment at any time (by calling the `sell()` function) and will receive 100% of their investment back. Once the _MFG_ is reached, the bonding curve starts, a fraction **I** of the MFG is funneled to the cash reserve and the complement (`MFG*(1-I)`) is being transfered to the beneficiary organization.

Also, before the _MFG_ is reached, the beneficiary organization can unilateraly decide to cancel the _CTO_ in which case investors can then withdraw 100% of the funds they individually invested.

It's important to note that once the _MFG_ is reached, then the organization cannot cancel the _CTO_ anymore and it will now continue to be live for a minimum period of time (defined in the smart-contract by the organization). Equally, after _MFG_ is reached, investors cannot withdraw their funds anymore as the bonding curve started. They can now only call the `sell()` function will operates as described in the previous section.

The _MFG_ protects both investors and the organization. It protects the investors because if there is low appeal from investors, the _MFG_ won't be reached and investors can withdraw their money. Plus, the fact that all early investors get averaged priced _COTs_ means that no early investors will get unreasonably low price _COTs_. But the _MFG_ also protects the organization as the organization can use it to gauge the market appetance for its _CTO_ and can decide to cancel it if investors interest is below its expectations. 

The organization should not set the _MFG_ too high though, otherwise it would have the effect of transforming the _CTO_ into a simple crowdfunding campaign and defeat the purpose of the _CTO_. In other words, the _CTO_ must reflect the **minimum** amount the organization expects to validate its _CTO_. It should definitely not be set to the entire value an organization expects to raise.

<h5 id="closing">Closing</h5>

A _CTO_ can continue indefinitely but it doesn't have to: the beneficiary organization can decide to close it at anytime *after* the minimum period of time expired.

In order to give some necessary visibility to investors, the beneficiary organization has to commit to keep its _CTO_ running for a minimum period of time (3 years, 5 years, 10 years...). After this minimum period of time has passed, the organization does not have to close its _CTO_ but it can. Also, at any single time, the organization can increase the minimum period of time it commits to keep its _CTO_ running to give increased visibility to investors.

Closing a _CTO_ is not free. To close its _CTO_, the beneficiary organization will have to pay an _exit fee_. The price of this exit fee is equal to the current issuance (`buy`) price of _COT_ multiplied by the number of _COTs_ outstanding. Once the exit fee is paid, the organization can close its _CTO_ which allows every single investor to then sell their _COTs_ at the same price: the current `buy` price (and hopefully the highest).

<img src="embed/exit_fee.png" width="600" title="Initialization phase" alt="Initialization phase" />

_Visualization of the exit fee required to close a Continuous Token Offering_

By doing this, it means that the last investor will make a white operation (bought at `buy` price and sold at the same price moments after) while early investors will hopefully turn a profit (it is obviously not guaranteed as the last issuance price is not necessarily the highest price).

<h4 id="properties">Properties and incentives of a Continuous Organization</h4>

<h5 id="longterm">🌲 Long-term investment focus</h5>

The spread that exists between the buy price and the sell price of _COTs_ creates an incentive for investors to buy and hold _COTs_ until the _Continuous Organization_ starts generating revenues:

1.  **Pre-revenue**. The price appreciation of _COTs_ is due to investors' speculation as they anticipate future revenues.
2.  **Post-revenues**. Once revenues begin to flow, the price appreciation of _COTs_ starts being driven by the revenues generated by the organization, as a fraction of the revenues is funneled to the buyback reserve of the _DAT_.

There is a clear incentive for investors to hold their COTs and act as long-term investors.

<h5 id="secondary">🤝Secondary market</h5>

The spread between the Buy and Sell curves also leaves space for a secondary market of _COTs_. If the current price of a newly minted _COT_ is 10, an investor would rather buy an already-minted _COT_ from another investor willing to sell at a better price than the buyback price offered by the _DAT_.

Obviously, this secondary market is bounded in a dynamic price range imposed by the _DAT_: it would not make sense for a buyer to bid a price higher than the current price proposed by the _DAT_. Likewise, it would not make sense for a seller to ask for a price lower than the price proposed by the _DAT_.

<img src="embed/Introducing-Continuous15.png" width="300" alt="Secondary market" title="Secondary market">

Said otherwise, an investor will always be better off buying or selling their _COTs_ in the secondary market, as the price will likely be better than the price proposed by the _DAT_.

Interestingly, the recent rise of automated market mechanisms for secondary markets (like [Uniswap](https://uniswap.exchange) or [Kyber network](https://kyber.network)) means that one could completely blend the primary market (the _DAT_) and the secondary market together from a UX perspective: a user would enter the value of _COTs_ he wants to buy and his trade could be automatically optimized between the primary and secondary market. This is a feature [Fairmint](https://fairmint.co) provides, which is important to reduce price volatility and maximize investors' returns.

<h5 id="liquidity">💧Guaranteed liquidity</h5>

One of the most valuable properties of a _Continuous Organization_ is that the liquidity of _COTs_ is immediate and guaranteed. If an investor does not find a buyer or a seller in the secondary market, they can always buy or sell tokens to the _DAT_. By construction, the _DAT_ always has the funds to buyback _COTs_ at a price defined by the _S_ function. The _DAT_ really acts as the organization's central bank, minting new tokens when demand exceeds available supply and contracting the token supply when sellers outnumber buyers.

In the proposed bonding curve model the buyback price (defined by the _S_ function) for a given supply is very low compared to the buy price (the _B_ function). So one could argue that, even if there is guaranteed liquidity, this liquidity has limited utility because investors would likely take a loss by selling to the _DAT_. This is true only if an investor buys _COTs_ and sells them back to the _DAT_ short thereafter.

However, if the investors have more patience and if the organization develops well:

1.  more investors will buy _COTs_, thus increasing both the buy and the sell price to where the investor will turn a profit by selling their _COTs_ back to the _DAT_.
2.  the organization will start generating revenues, thus automatically increasing the buyback reserve and increasing the value of COTs (using the mechanism described previously).
3.  the organization can also start distributing _COTs_ directly if it is doing well and sees an interest in doing so. Distributing _COTs_ has a double effect:
   1.  significantly increasing sell price because these _COTs_ are bought from the _DAT_ and the funds are 100% saved in the buyback reserve, thus increasing the value of _s_ and with it the minimum sell price.
   2.  increasing the investor's return on investment (ROI) as the investors can decide to immediately sell back the _COTs_ they received to cash them out.

Finally, it is good to keep in mind that the _DAT_ is only the buyer-of-last-resort. It is very likely that an investor could sell their _COTs_ on the secondary market at a higher price than the "buy-back price" offered by the cash reserve of the _DAT_ for a given supply.

<h5 id="fundraising">💰 Continuous fundraising</h5>

By construct, a _Continuous Organization_ is continuously fundraising as investors can permission-lessly buy and sell the organization's _COTs_ at any time:

*   Any increase in _COT_ supply (i.e., a _COT_ that is being minted by the _DAT_, not bought on the secondary market) directly translates into funding for the organization.
*   Any decrease in _COT_ supply (i.e., a _COT_ that is being sold to the _DAT_, not sold on the secondary market) is being paid by the buyback reserve of the _DAT_ and does not affect the organization's treasury.

Whereas in the traditional VC financing model, fundraising defocuses the entrepreneur in a time-consuming and uncertain process that creates dangerous valuation thresholds, COs help the entrepreneur stay focused on execution and make the organization more resilient to the business ups and downs.

To illustrate this, let's take the example of a _Continuous Organization_ whose _COT_ price **over time** as measured by the buy function of the DAT follows the following very volatile curve:

<img src="embed/volatility.png" width="400" title="Volatility" alt="Volatility" />

The zones in **blue** correspond to upward trends of the _COT_ price, which translates into the _Continuous Organization_ raising funds. Alternatively, the white zones are downward trends which translates into the _DAT_ (**not** the organization) buying back the _COTs_ that are being sent to it using its buyback reserve.

<h3 id="implementations">Implementations</h3>

The _Continuous Organization_ model is blockchain agnostic but requires a turing-complete smart-contract language to be implemented. The availability of stablecoins are not necessarily a requirement but they definitely improve the UX of _Continuous Organizations_.

A reference implementation for the Ethereum blockchain has been [specified](https://github.com/fairmint/c-org/wiki) and [implemented](https://github.com/fairmint/c-org) (in Vyper language) by [Fairmint](https://fairmint.co). The contracts used for the _Continuous Organization_ are a fork of the fairmint c-org contracts, which were audited by [Consensys Diligence](https://diligence.consensys.net) and the results of the audit will be made public as soon as it is finalized.

<h3 id="legal">Legal & Regulatory considerations</h3>

**DISCLAIMER**: What is written in this section as it only reflects the author's opinion and does **not** constitute a legal opinion. Please consult a lawyer specialized in Securities law in your jurisdiction for a legal opinion.

A _Continuous Organization_ requires the setup of a _Continuous Token Offering_ (CTO). Apart from the _continuous_ aspect of the offering, which is novel, a CTO is simply another type of token Offering. As such, a _Continuous Organization_ will very likely need to comply with the digital tokens law in its jurisdiction.

<h2 id="annex">Annex</h2>

<h3 id="buy-calculus-proof">Buy() calculus</h3>

When buying _COTs_, you need to perform a calculus to know how much _COTs_ you will get for the amount you are willing to invest.

<img src="embed/buy-calculus.png" width="450" title="Proof" alt="Proof" />

Let's calculate the number of _COTs_ `x` received when `d` is invested when `a` _COTs_ have already been minted. We have the following:

<img src="embed/buy-calculus-formula-1.png" title="Proof" alt="Proof" />

So the number of tokens minted for an investment `d` is:

<img src="embed/buy-calculus-formula-2.png" title="Proof" alt="Proof" />

<h3 id="sell-calculus-proof">Sell() calculus</h3>

When selling _COTs_, you need a calculus to know how much you will get back for the amount of _COTs_ you are willing to sell.

<img src="embed/sell-calculus.png" width="450" title="Proof" alt="Proof" />

Let's calculate the number value `M` received when `x` _COTs_ are sold when `a` _COTs_ have already been minted. We have the following:

<img src="embed/sell-calculus-formula-1.png" title="Proof" alt="Proof" />

Which gives:

<img src="embed/sell-calculus-formula-2.png" title="Proof" alt="Proof" />

As `s` is easy to calculate:

<img src="embed/sell-calculus-formula-3.png" title="Proof" alt="Proof" />

We ultimately get:

<img src="embed/sell-calculus-formula-4.png" title="Proof" alt="Proof" />

<h4 id="burn-factor-proof">The burn factor</h4>

Now the sell calculus show above is right only when no _COTs_ are burnt. If _COTs_ are burnt, the burnt value is redistributed proportionally at each `sell()`. Here is how it works in a scenario where we have `x'` burnt tokens and `x` tokens in circulation. We have a theoretical burnt value of `R'` as shown in the following graph:

<img src="embed/burn-factor-1.png" width="450" title="Proof" alt="Proof" />

We have:

<img src="embed/sell-calculus-formula-5.png" title="Proof" alt="Proof" />

Now, we do not want this value `R'` locked forever. We want to redistribute it to current _COTs_ holder so let's "spread" `R'` accross all current _COTs_ holders:

<img src="embed/burn-factor-2.png" width="450" title="Proof" alt="Proof" />

We have:

<img src="embed/sell-calculus-formula-6.png" title="Proof" alt="Proof" />

Which means we can now express the complete `sell()` function, including the burn factor:

<img src="embed/sell-calculus-formula-7.png" title="Proof" alt="Proof" />
