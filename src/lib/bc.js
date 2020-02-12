import store from '../stores/Root'

// get by curve for y
const buy = (price) => {
    store.tradingStore.getPriceToBuy(price)
}

//  get sell curve for x
const sell = (price) => {
    store.tradingStore.getRewardForSell(price)
}
// apply function to range at res scale, get x y pairs
const rapply = (beg, end, res, f) => {
  const arr = []
  for(let v = beg; v < end; v += res) {
    arr.push({x: v, y: f(v)})
  }
  return arr
}

const rapplyAsync = async (beg, end, res, f) => {
  const arr = []
  for(let v = beg; v < end; v += res) {
    const w = await f(v)
    arr.push({x: v, y: v})
  }
  return arr
}

export const buyCurve = async (beg, end, res, f) => {
  return await rapplyAsync(beg, end, res, buy)
}


export const sellCurve = async (beg, end, res, f) => {
  return await rapplyAsync(beg, end, res, sell)
}
