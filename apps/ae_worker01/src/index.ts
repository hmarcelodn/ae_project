import Bull from "bull";

const queue = new Bull('intensive_queue', 'redis://127.0.0.1:6379');

queue.process(async (job, done) => {
    const future = Date.now() + 3000;
    while (Date.now() < future);
    console.log(`${job.id} done`);
    done();
});