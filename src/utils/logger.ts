
class Logger {

    log(message: string) {
        console.log(`Logging: ${message}`);
    }
}

const logger = new Logger();

export default logger;