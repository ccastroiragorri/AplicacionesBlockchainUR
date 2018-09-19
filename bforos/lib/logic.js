/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
* Claim a Research object after it is created
* Reciebe a reward on succesefully claimed Ro's
*@param {org.bforos.Claim} claimData
*@transaction
*/
async function claimRO(claimData) {
    // define reward for claiming objetc
    const points = claimData.Ro.reward;
    // get wallet balance from claimant
    const balance = claimData.claimer.wallet;
    // new balance
    claimData.claimer.wallet = balance + points;
    // assigned ownership of claimed objetc
    claimData.Ro.owner = claimData.claimer;
    // 1. update asset registry
    let assetRegistry = await getAssetRegistry('org.bforos.ResearchOJ');
    await assetRegistry.update(claimData.Ro);
    let participantRegistry = await getParticipantRegistry('org.bforos.Researcher');
    await participantRegistry.update(claimData.claimer);
    // Emit an event for the modified participant wallet.
    let event = getFactory().newEvent('org.bforos', 'WalletEvent');
    event.claimer = claimData.claimer;
    event.oldbalance = balance;
    event.newbalance = balance+points;
    emit(event);
}

/**
* Collect Research object for use in own research
* pay the cost of collectin Ro's
*@param {org.bforos.Collect} collectData
*@transaction
*/
async function collectRO(collectData) {
    // define cost for collecting objetc
    const points = collectData.Ro.cost;
    // get wallet balance from collector
    const balance = collectData.claimer.wallet;

    if (balance-points < 0) {
        throw new Error('Wallet amount insuficient for transaction');
    } else {
        // new balance
        collectData.claimer.wallet = balance - points;
    }

    let participantRegistry = await getParticipantRegistry('org.bforos.Researcher');
    await participantRegistry.update(collectData.claimer);

    // Emit an event for the modified participant wallet.
    const event = getFactory().newEvent('org.bforos', 'WalletEvent');
    event.claimer = collectData.claimer;
    event.oldbalance = balance;
    event.newbalance = balance-points;
    emit(event);
}

/**
* Enrich a Research object after it is created
* Recieve a reward on succesefully Enriched Ro's
*@param {org.bforos.Enrich} enrichData
*@transaction
*/
async function enrichRO(enrichData) {
    // define reward for enriching objetc
    const points = enrichData.Ro.reward;
    // get wallet balance for contributor
    const balance = enrichData.contributor.wallet;
    // new balance
    enrichData.contributor.wallet = balance + points;
    // assigned contributor of enriched objetc
    enrichData.Ro.contributor.push(enrichData.contributor);
    // 1. update asset registry
    let assetRegistry = await getAssetRegistry('org.bforos.ResearchOJ');
    await assetRegistry.update(enrichData.Ro);    
    // 2. update participant registry
    let participantRegistry =  await getParticipantRegistry('org.bforos.Researcher');
    await participantRegistry.update(enrichData.contributor);

    // Emit an event for the modified participant wallet.
    const event = getFactory().newEvent('org.bforos', 'WalletEvent');
    event.claimer = enrichData.contributor;
    event.oldbalance = balance;
    event.newbalance = balance+points;
    emit(event);
}

/**
* Enrich a Research object after it is created
* Recieve a reward on succesefully Enriched Ro's
*@param {org.bforos.ResearchOJHistory} transaction
*@transaction
*/
async function getResearchOJHistory(transaction){
    const ROId = transaction.ROId
    const nativeSupport = transaction.nativeSupport;

    const assetRegistry = await getAssetRegistry('org.bforos.ResearchOJ');

    const nativeKey = getNativeAPI().createCompositeKey('Asset:org.bforos.ResearchOJ', [ROId]);
    const iterator = await getNativeAPI().getHistoryForKey(nativeKey);
    let results = [];
    let res = { done: false };
    while (!res.done) {
        res = await iterator.next();

        if (res && res.value && res.value.value) {
            const value = res.value.value.toString('utf8');
            const record = {
                tx_id: res.value.tx_id,
                value: value,
                timestamp: res.value.timestamp
            };          
            results.push(JSON.stringify(record));
        }
        if (res && res.done) {
            try {
                iterator.close();
            } catch (err) {
            }
        }
    }

    const event = getFactory().newEvent('org.bforos', 'ResearchOJHistoryResults');
    event.results = results;
    emit(event);

    // return results;
}
