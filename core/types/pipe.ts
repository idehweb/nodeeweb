import { ClassConstructor } from 'class-transformer';
import { MiddleWare } from './global';

export interface Pipe<A> {
  pipeCreator(args: A): MiddleWare;
}

export type ValidateArgs = {
  reqPath: 'body' | 'query' | 'params';
  dto: ClassConstructor<unknown>;
};

export interface ValidatePipe extends Pipe<ValidateArgs | ValidateArgs[]> {}
