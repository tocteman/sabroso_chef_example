import React from 'react'
import type {IMenu} from '../models/MenuTypes'

export const groupBy = (key:string) => (array:any[]) =>
  array.reduce((objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
    })
 , {});

export const menusGroupBy = (key:string) => (array:IMenu[]) =>
  array.reduce((objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
    })
 , {});




// tomado de https://gist.github.com/JamieMason/0566f8412af9fe6a1d470aa1e089a752
// const cars = [
//   { brand: 'Audi', color: 'black' },
//   { brand: 'Audi', color: 'white' },
//   { brand: 'Ferarri', color: 'red' },
//   { brand: 'Ford', color: 'white' },
//   { brand: 'Peugot', color: 'white' }
// ];

// const groupByBrand = groupBy('brand');
// const groupByColor = groupBy('color');

// console.log(
//   JSON.stringify({
//     carsByBrand: groupByBrand(cars),
//     carsByColor: groupByColor(cars)
//   }, null, 2)
// )
