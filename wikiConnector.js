export class WikiConnector {

    constructor(messageHandler) {
        const url = 'https://stream.wikimedia.org/v2/stream/rdf-streaming-updater.mutation-main.v2';
        const eventSource = new EventSource(url);

        eventSource.onopen = () => {
            console.info('Opened connection.');
        };
        eventSource.onerror = (event) => {
            console.error('Encountered error', event);
        };
        eventSource.onmessage = messageHandler;
    }
}
