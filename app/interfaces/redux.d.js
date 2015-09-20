
type ActionCreators = {
  [key: string]: Function
}

declare module "redux1" {

  declare function bindActionCreators(actionCreators: Function | ActionCreators, dispatch: Function): Array<Function>;

  declare function createStore(): void;

  declare function applyMiddleware(middleware: Function, ...middleware: Array<Function>): Function;
}

declare module "redux-thunk1" {
  declare function thunk<Action>(actionCreators: Array<Action>): void;
}

declare module "react-redux" {
  declare function Provider(): void;
  declare function connect<State>(mapStateToProps: (state: State) => any, mapDispatchToProps: (dispatch: Function) => Array<Function>, mergeProps: any): Function;
}
