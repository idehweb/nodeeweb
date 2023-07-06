import CronJob from 'node-cron';
import { SingleJobProcess } from '../../../job/index.mjs';
import mongo from 'mongoose';
const cronMap = new Map();

export function createAutomation(auto, mongoose = mongo) {
  // create core
  async function core() {
    try {
      // 1. execute pipeline
      const method = auto.query_pipe ? 'find' : 'aggregation';
      const pl = auto.query_pipe ?? auto.aggregation_pipe;
      const pl_property = auto.query_pipe ? 'query' : 'pipeline';

      const result =
        (await mongoose.model(pl.model)[method](pl[pl_property])) ?? [];

      // 2. parse action args
      const parsed_args = result.map((doc) =>
        actionArgParser(doc, auto.action.args)
      );

      await findBaseActionByName(auto.action.base_action_name)(parsed_args);
    } catch (error) {
      console.log('error', error);
    }
  }

  // create cron
  const cron = CronJob.schedule(
    auto.crontab_expr,
    SingleJobProcess.builderAsync(String(auto._id), core),
    {
      timezone: process.env.TZ || 'Asia/Tehran',
    }
  );
  cron.start();
  cronMap.set(String(auto._id), cron);
}

export async function updateAutomation(auto, mongoose = mongo) {
  await deleteAutomation(auto, mongoose, false);
  createAutomation(auto, mongoose);
}

export async function deleteAutomation(id, mongoose = mongo, delFromDB) {
  const cron = cronMap.get(String(id));
  if (cron) {
    cron.stop();
    cronMap.delete(String(id));
  }

  if (delFromDB) {
    await mongoose
      .model('Automation')
      .findByIdAndUpdate(id, { $set: { active: false } });
  }
}

function findBaseActionByName(action_name) {
  // TODO
  return async (docs) => {
    console.log(
      'in action',
      action_name,
      'receives: ',
      JSON.stringify(docs, null, '  ')
    );
  };
}

function actionArgParser(doc, args) {
  const myArgs = JSON.parse(JSON.stringify(args));
  const stack = [{ parent: null, key: null, value: myArgs }];
  do {
    const { parent, key, value } = stack.pop();
    if (Array.isArray(value)) {
      stack.push(
        ...value.map((c, i) => stack.push({ parent: value, key: i, value: c }))
      );
    } else if (typeof value === 'object') {
      stack.push(
        ...Object.entries(value).map(([k, v]) => ({
          parent: value,
          key: k,
          value: v,
        }))
      );
    } else {
      // number , boolean
      if (typeof value !== 'string') continue;

      // string
      parent[key] = value
        .split(' ')
        .map((token) => {
          if (!token.startsWith('$')) return token;
          return doc[token.slice(1)];
        })
        .join(' ');
    }
  } while (stack.length);
  return myArgs;
}

export async function initiateAutomation(model) {
  const autos = await model.find({ active: true });
  autos.map((auto) => createAutomation(auto));
}
