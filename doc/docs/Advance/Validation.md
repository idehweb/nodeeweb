---
sidebar_position: 5
---

# Validation
It is best practice to validate the correctness of any data sent into a web application. To automatically validate incoming requests, Nodeeweb provides validation pipe available

## Table of Contents

- [Structure](#structure)
- [Register](#register)
- [Usage](#usage)

## Structure

### Pipe
pipes are middleware creators
```ts
interface Pipe<A> {
  pipeCreator(args: A): MiddleWare;
}
```

### Validation Pipe 
validations are one types of pipe
```ts
export type ValidateArgs = {
  reqPath: 'body' | 'query' | 'params';
  dto: ClassConstructor<unknown>;
};

export interface ValidatePipe extends Pipe<ValidateArgs | ValidateArgs[]> {}
```

## Register
by default **core** register `CoreValidationPipe` but you can customize your validation pipe like below:
```ts
registerValidationPipe({
    from: 'CustomService',
    validation: new CustomValidationPipe(),
  })
```

## Usage
validation use in **controller register** when schema pass *validation* argument