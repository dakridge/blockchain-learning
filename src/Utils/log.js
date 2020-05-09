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
            break;
        }

        case 'error': {
            console.log(chalk.red.bold(message))
            break;
        }

        case 'success': {
            console.log(chalk.greenBright.bold(`✔ ${message}`))
            break;
        }

        case 'warning': {
            console.log(chalk.yellowBright.bold(`${message}`))
            break;
        }

        default: {
            // pass
        }
    }
}

export default log;
