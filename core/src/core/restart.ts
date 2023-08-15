import { RestartBody } from '../../dto/in/restart.dto';
import { MiddleWare } from '../../types/global';
import restart from '../../utils/restart';

export class RestartService {
  restart: MiddleWare = async (req, res) => {
    const body: RestartBody = req.body;
    await restart({
      external_wait: body.wait,
      internal_wait: body.wait,
      policy: body.policy,
    });
    return res.status(200).send();
  };
}

const restartService = new RestartService();

export default restartService;
