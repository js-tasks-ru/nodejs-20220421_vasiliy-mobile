const path = require('path');
const uuid = require('uuid');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const sessions = Object.create(null);

router.get('/subscribe', async (ctx) => {
  const sessionId = uuid.v4();

  ctx.req.on('aborted', () => {
    delete sessions[sessionId];
  });

  return await new Promise((resolve) => {
    sessions[sessionId] = resolve.bind(this);
  }).then((message) => {
    ctx.body = message;
  }).finally(() => {
    delete sessions[sessionId];
  });
});

router.post('/publish', async (ctx) => {
  const {message} = ctx.request.body;

  if (!message) {
    ctx.status = 400;

    return;
  }

  for (const [, resolve] of Object.entries(sessions)) {
    resolve(message);
  }

  ctx.body = 'OK';
});

app.use(router.routes());

module.exports = app;
