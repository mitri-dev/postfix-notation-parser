// Elements
const form = document.querySelector('form')
const input = document.querySelector('input')
const output = document.querySelector('.output')
const btns = document.querySelectorAll('button')
const NUMBER = [1,2,3,4,5,6,7,8,9,0]
const OP = ['+', '-', '*', '/', ')']

// Events
form.addEventListener('submit', parse)
btns[0].addEventListener('click', () => {
  input.value = '4+((6*7)/5)'
})
btns[1].addEventListener('click', () => {
  input.value = '3+((6+3/4)-5+6)'
})
btns[2].addEventListener('click', () => {
  input.value = '5+6+7+8+8(2/1)'
})

// Functions
function parse(e) {
  e.preventDefault()
  const expression = input.value.split('')
  const pile = []
  const result = []

  for (let i = 0; i < expression.length; i++) {
    let e = expression[i];
    
    // Numero
    if(NUMBER.includes(+e)) {
      result.push(e)
    }

    // + || -
    if(e === '+' || e === '-') {
      if(pile.length === 0) {
        pile.push(e)
      } else if(OP.includes(pile[pile.length - 1])){
        result.push(pile.pop())
        pile.push(e)
      }
      if(pile[pile.length - 1] === '(') {
        pile.push(e)
      } 
    }

    // * || /
    if(e === '*' || e === '/') {
      if(pile.length === 0) {
        pile.push(e)
      } else if(['+', '-'].includes(pile[pile.length - 1])) {
        pile.push(e)
        
      } else if(OP.includes(pile[pile.length - 1])){
        result.push(pile.pop())
        pile.push(e)
      }
      if(pile[pile.length - 1] === '(') {
        pile.push(e)
        
      }
      if(['+', '-'].includes(pile[pile.length - 1])) {
        pile.push(e)
        
      }
    }

    // ( || )
    if(e === '(') {
      if(NUMBER.includes(+expression[i - 1])) {
        pile.push('*')
      }
      pile.push(e)
    }
    if(e === ')') {
      do {
        result.push(pile.pop())
      } while (pile[pile.length - 1] != '(');
      pile.pop()


    }
  }
  
  do {
    result.push(pile.pop())
  } while (pile.length - 1 === 0);

  output.innerHTML = result
}
