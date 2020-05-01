// dependencies
import chalk from 'chalk';

const log = (type, message) => {
    switch (type) {
        case 'info': {
            console.log(chalk.cyan.bgWhiteBright.bold(message))
            break;
        }

        default: {
            // pass
        }
    }
}

export default log;
