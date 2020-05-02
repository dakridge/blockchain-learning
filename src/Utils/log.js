// dependencies
import chalk from 'chalk';

const log = (type, message) => {
    switch (type) {
        case 'info': {
            console.log(chalk.cyan.bgWhiteBright.bold(message))
            break;
        }

        case 'important': {
            const paddedMessage = `  ${message}  `;
            const dahses = Array.from({ length: paddedMessage.length }).map(() => { return '-'; }).join('');

            console.log('\n');
            console.log(chalk.yellowBright.bold(dahses));
            console.log(chalk.greenBright.bold(paddedMessage))
            console.log(chalk.yellowBright.bold(dahses));
            console.log('\n');
        }

        default: {
            // pass
        }
    }
}

export default log;
