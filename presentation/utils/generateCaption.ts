// Dependencies
import { FieldError } from 'react-hook-form'

// Utils funtion
export const generateCaption = (error: FieldError | null): string => {
  let message = ''
  if (error) {
    switch (error.type) {
      case 'required':
        message = 'Esse campo é requerido!'
        break
      case 'minLength':
        message = `Esse campo não atente a quantidade mínima de caracteres!`
        break
    }
  }
  return message
}