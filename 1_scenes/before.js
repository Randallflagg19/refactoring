import invoice from './invoice.json' with { type: 'json' };
import plays from './plays.json' with { type: 'json' };

// invoice счет


// Возвращает текст счёта для заданного клиента и спектаклей

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;

    let result = `Счёт для ${invoice.customer}\n`;


    // для форматирования валюты создаем формат
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format;


    for (let perf of invoice.performances) {

        // в плее значение, то есть название пьесы
        const play = plays[perf.playID];

        let thisAmount = 0;

        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`неизвестный тип: ${play.type}`);
        }

        // бонус за каждые десять зрителей сверх 30
        volumeCredits += Math.max(perf.audience - 30, 0);

        // дополнительный бонус для комедий
        if ("comedy" === play.type)
            volumeCredits += Math.floor(perf.audience / 5);

        // печать строки счета
        result += `  ${play.name}: ${format(thisAmount / 100)} (${perf.audience} мест)\n`;
        totalAmount += thisAmount;
    }

    result += `Итого с вас ${format(totalAmount / 100)}\n`;
    result += `Вы заработали ${volumeCredits} бонусов\n`;
    return result;
}

console.log(statement(invoice, plays));

export default statement;
