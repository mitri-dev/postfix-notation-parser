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
  input.value = '5+6+7+8(2/1)'
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

  output.innerHTML = '<h2>Notacion Postfija</h2><p>'+result+'</p>'
  parseTree(result)
}

function parseTree(postfix) {
  const nodeList = []
  let y = 0
  for (let i = 0; i < postfix.length; i++) {

    const e = postfix[i];
    
    if(NUMBER.includes(+e)) {
      nodeList.push(new NumberNode(e, y))
    }

    if(OP.includes(e)) {
      const left = nodeList.pop()
      left.y = y
      const right = nodeList.pop()
      right.y = y
      y++
      nodeList.push(new Node(e, right, left, y, y*2))
    }    
  }
  output.innerHTML += '<h2>Arbol</h2><div>'+nodeList[0].rep()+'</div>' 
  displayTree(nodeList[0])
}

function Node(value, left = null, right = null, y = 0, x = 0) {
  this.value = value
  this.left = left
  this.right = right

  this.y = y
  this.x = x

  // this.z = z;
  this.rep = () => {
    return `(${this.left.rep()}, ${this.value}, ${this.right.rep()})`;
  }

  this.actualizarX = (x) => {
    this.x = x;
    this.left.actualizarX(x - numeroPar(y))
    this.right.actualizarX(x + numeroPar(y))
  }

  this.render = () => {
    const renderDOM = document.querySelector('.render')
    const div = document.createElement('div')
    div.textContent = this.value
    div.classList.add('node')
    div.style.top = -this.y + 'em'
    div.style.left = this.x + 'em'

    renderDOM.appendChild(div)

    this.left.render()
    this.right.render()
  } 
}
function NumberNode (n, y = 0, x = 0) {
  this.value = n
  this.x = x;
  this.y = y
  
  this.rep = () => {
    return `${this.value}`
  }

  this.actualizarX = (x) => {
    this.x = x;
  }

  this.render = () => {
    const renderDOM = document.querySelector('.render')
    const div = document.createElement('div')
    div.textContent = this.value
    div.classList.add('node')
    div.style.top = -this.y + 'em'
    div.style.left = this.x + 'em'
    renderDOM.appendChild(div)
  }
}

function displayTree(tree) {
  const renderDOM = document.querySelector('.render')
  renderDOM.innerHTML = ''
  console.log(tree)
  tree.actualizarX(tree.y)
  tree.render()
}

function numeroPar(posicion) {
  if(posicion === 1) return 1
  let i = 2
  let n = 0
  do {
    n = n + 2
    i++
  } while (i <= posicion);
  return n

}