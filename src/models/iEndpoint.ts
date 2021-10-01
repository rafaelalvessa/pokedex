export default interface IEndpoint<P, R> {
  execute(params: P): Promise<R>;
}
