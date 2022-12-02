/**
 * Simple protocol typing for matrix operations inside web worker thread
 * idea just 4 fun 🦫
 *
 * At first abstract protocol definition
 */

export type Protocol = {
  [command: string]: {
    income: Array<unknown>,
    outcome: unknown
  }
}

export function createThreadProtocol<P extends Protocol>(workerScriptPath: string){
  return <K extends keyof P>(query: K) => (...args: P[K]['income']) =>
    new Promise<P[K]['outcome']>((resolve, reject) => {

      const thread = new Worker(new URL(workerScriptPath))
      thread.onerror = reject
      thread.onmessage = (message) => resolve(message.data.data)
      thread.postMessage({query, args})
    })
}


/**
 * Here client implementation
*/

 type Tensor = Array<number[]>

 type TensorProtocol = {
   sum: {
     income: [Tensor, Tensor]
     outcome: Tensor
   },
   determinant: {
     income: [Tensor]
     outcome: number
   },
   divide: {
     income: [Tensor, Tensor]
     outcome: Tensor
   }
 }

// (!) TensorWorker just abstract and not implemented yet
const tensorProtocolThread = createThreadProtocol<TensorProtocol>('./TensorWorker.ts')
const parallelTensorSum = tensorProtocolThread('sum')

parallelTensorSum([[132, 181], [235, 84]], [[335, 116], [374, 23]])
.then(sum => {console.log({sum})})