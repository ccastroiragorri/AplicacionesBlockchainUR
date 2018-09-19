# bforos-bnav1

# Blockchain4openscience

Blockchain4openscience.org implements the blockchain 
for open science using various reward mechanisms by
smart contracts over assets (research objetcs) and transactions.

This business network defines:

 **Participant**
`Researcher`
`Institution`

**Asset**
`ResearchOJ`
`Disco`

**Transaction**
`Claim`
`Collect`
`Enrich`

**Event**
`WalletEvent`

`Reasearcher` participant is able to claim a research object `ResearchOJ` asset of different types (document, code, database, presentation, image, etc..) and stored in the World Wide Web. Initially the `ResearchOJ` is declared and then claimed by the researcher. The `Reasearcher` recived an reward from claiming a `ResearchOJ` this reward will be reflected in his personal wallet using the smart contract `Claim` that generates an event `WalletEvent` that indicates that the wallet has been updated. Additionally, the smart contract `Claim` assigns ownership of the asset to the `Reasearcher`. 

To test this Business Network Definition in the **Test** tab:

Create two `Researcher` participant:

```
{
  "$class": "org.bforos.Researcher",
  "email": "juan.uno@bforos.org",
  "firstName": "juan",
  "lastNam": "uno",
  "wallet": 10
}
```

```
{
  "$class": "org.bforos.Researcher",
  "email": "juan.dos@bforos.org",
  "firstName": "juan",
  "lastNam": "dos",
  "wallet": 10
}
```

Create two `ResearchOJ` asset:

```
{
  "$class": "org.bforos.ResearchOJ",
  "ROId": "RO01",
  "typero": "document",
  "address": "www.juanuno.com",
  "reward": 5,
  "cost": 1
}
```

```
{
  "$class": "org.bforos.ResearchOJ",
  "ROId": "RO02",
  "typero": "code",
  "address": "www.juanuno.com",
  "reward": 5,
  "cost": 1
}
```

Submit a `Claim` transaction:
```
{
  "$class": "org.bforos.Claim",
  "Ro": "resource:org.bforos.ResearchOJ#RO01",
  "claimer": "resource:org.bforos.Researcher#juan.uno@bforos.org"
}
```
This transaction has registered the research objet `ROId:RO01` to `juan.uno@bforos.org`; additionally it rewards 5 points to `juan.uno@bforos.org`. This reward will be reflected in the new state of his wallet; the change in the state of the wallet is recorded as an event.

```
{
 "$class": "org.bforos.WalletEvent",
 "claimer": "resource:org.bforos.Researcher#juan.uno@bforos.org",
 "oldbalance": 10,
 "newbalance": 15,
 "eventId": "ce75b0e7-554b-4fff-a890-dee65067338c#0",
 "timestamp": "2018-02-28T16:03:44.534Z"
}
```

There are two other smart contract in this business network, `Collect` and `Enrich`.

Submit a `Collect` transaction:

```
{
  "$class": "org.bforos.Collect",
  "Ro": "resource:org.bforos.ResearchOJ#RO01",
  "claimer": "resource:org.bforos.Researcher#juan.dos@bforos.org"
}
```

This transaction allows the research object `ROId:RO01` to be used by `juan.dos@bforos.org` and records this in the registry. Additionally the collection of the object has a cost of 1 point for `juan.dos@bforos.org`. This cost will be reflected in the new state of his wallet; the change in the state of the wallet is recorded as an event using `WalletEvent`, that we used before.

Submit a `Enrich` transaction:

```
{
  "$class": "org.bforos.Enrich",
  "Ro": "resource:org.bforos.ResearchOJ#RO01",
  "contributor": "resource:org.bforos.Researcher#juan.dos@bforos.org"
}
```

This transaction has registered `juan.dos@bforos.org` as a contributor to the existing research object `ROId:RO01`; additionally it rewards 5 points to `juan.dos@bforos.org` for his contribution to an existing research object. This reward will be reflected in the new state of his wallet; the change in the state of the wallet is recorded as an event.


