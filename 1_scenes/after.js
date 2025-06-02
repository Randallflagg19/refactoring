import invoice from './invoice.json' with { type: 'json' };
import plays from './plays.json' with { type: 'json' };

function volumeCreditsFor(perf){
    let result = 0;

    // бонус за каждые десять зрителей сверх 30
    result += Math.max(perf.audience - 30, 0);

    // дополнительный бонус для комедий
    if ("comedy" === getPlay(perf).type)
        result += Math.floor(perf.audience / 5);

    return result;
}

function getPlay(aPerformance){
    return  plays[aPerformance.playID];
}

function priceFor(aPerformance){

    let result = 0;

    switch (getPlay(aPerformance).type) {
        case "tragedy":
            result= 40000;

            if (aPerformance.audience > 30) {
                result+= 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result= 30000;

            if (aPerformance.audience > 20) {
                result+= 10000 + 500 * (aPerformance.audience - 20);
            }
            result+= 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`неизвестный тип: ${getPlay(aPerformance).type}`);
    }
    return result;
}

function usd(aNumber){
    return  new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(aNumber / 100)
}

function totalVolumeCredits(){
    let result = 0;

    for (let perf of invoice.performances) {
        result += volumeCreditsFor(perf);
    }

    return result;
}

function totalAmount(){
    let result = 0;

    for (let perf of invoice.performances) {
        result += priceFor(perf);
    }

    return result;
}

function statement(invoice) {

    let result = `Счёт для ${invoice.customer}\n`;

    for (let perf of invoice.performances) {
        // печать одной строки счета
        result += `${getPlay(perf).name}:`
        result += ` ${usd(priceFor(perf))} (${perf.audience} мест)\n`;
    }

    result += `Итого с вас ${usd(totalAmount() / 100)}\n`;
    result += `Вы заработали ${totalVolumeCredits()} бонусов\n`;
    return result;
}

console.log(statement(invoice, plays));

export default statement;
