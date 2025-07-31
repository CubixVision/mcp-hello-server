// src/tools/index.ts
import { hello } from './hello'
import { goodbye } from './goodbye'
import { add } from './math/add'
import { subtract } from './math/subtract'
import { multiply } from './math/multiply'
import { divide } from './math/divide'

export const tools = {
  hello,
  goodbye,
  "math.add": add,
  "math.subtract": subtract,
  "math.multiply": multiply,
  "math.divide": divide
}
