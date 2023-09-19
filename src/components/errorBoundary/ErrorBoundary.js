import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

/* Компонент предохранитель, выведет сообщение вместо дочернего компонента в котором случилась ошибка */
class ErrorBoundary extends Component {
  state = {
    error: false
  }



  componentDidCatch(error, errorInfo) {
    this.setState({
      error: true,
    })
  }

  render() {
    if (this.state.error) {
      return <ErrorMessage/>
     }
    /* Если нет ошибки, возвращаем компонент который был в него передан (ребенок) */
    return this.props.children;
  }
}

export default ErrorBoundary;