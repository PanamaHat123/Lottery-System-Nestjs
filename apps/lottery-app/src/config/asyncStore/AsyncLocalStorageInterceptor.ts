import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError,map } from "rxjs";
import {AsyncStore} from "./AsyncStore";

@Injectable()
export class AsyncLocalStorageInterceptor implements NestInterceptor {
  private count:number= 10000;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const store = this.createStore(context);
    return Observable.create(observer => {
      AsyncStore.run(store, () => {
        const subscription = next.handle().subscribe({
          next: (data) => {
            // const store3 = AsyncStore.getStore();
            observer.next(data);
          },
          error: (error) => {
            const store2 = AsyncStore.getStore();
            // continue store context
            error._store_ = store
            observer.error(error);
          },
          complete: () => {
            observer.complete();
          },
        });
        return () => {
          subscription.unsubscribe();
        };
      })
    })
  }

  private createStore(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const store = new Map<string, any>();
    //@ts-ignore
    store.set('user', req?.user?.user);
    store.set('contextId', this.getCount());
    return store;
  }

  private getCount(){
    if(this.count==Number.MAX_SAFE_INTEGER){
      this.count = 10000;
    }
    return this.count++
  }

}