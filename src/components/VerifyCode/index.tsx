import { FC, ReactElement, useEffect, useRef, useState } from 'react'

type VerifyCodeProps = {
  width?: number; // 验证码图片宽度
  height?: number; // 验证码图片高度
  letters?: string; // 验证码字符集
  length?: number; // 验证码位数
  maxFontSize?: number; // 验证码最大字体大小
  minFontSize?: number; // 验证码最小字体大小
  change(code: string): void; // 验证码改变事件
}

const VerifyCode: FC<VerifyCodeProps> = (props: VerifyCodeProps) : ReactElement => {
  const TEXTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  const LINES = 6 // 干扰线数量
  const DOTS = 50 // 干扰点数量

  const { width = 120, height = 40, letters = TEXTS, length = 4, minFontSize = 20, maxFontSize = 30, change } = props
  const verifyCodeRef = useRef<any>(null)
  const [ctx, setCtx] = useState<any>()
  
  useEffect(() => {
    setCtx((verifyCodeRef as any).current.getContext("2d"))
  }, [verifyCodeRef])

  useEffect(() => {
    ctx && drawCodeImg()
  }, [ctx])

  // 点击
  const handleClick = () : void => {
    drawCodeImg()
  }
  
  // 绘制验证码
  const drawCodeImg = () : void => {
    // 绘制背景
    ctx.fillStyle = randomColor(200, 230)
    ctx.fillRect(0, 0, width, height)
  
    drawText()
    drawLine()
    drawDot()
  }
  
  // 随机数
  const randomNum = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)
  
  // 随机颜色
  const randomColor = (min: number, max: number) : string => {
    return `rgb(${randomNum(min, max)}, ${randomNum(min, max)}, ${randomNum(min, max)})`
  }
  
  // 绘制文本
  const drawText = (): void => {
    let code = ''
    for (let index = 0; index < length; index++) {
      const fontSize = randomNum(minFontSize, maxFontSize) // 字体大小
      const fontWidth = maxFontSize - minFontSize + 6 // 字体宽度
      const textSpace = (width - fontWidth * length) / (length + 1) // 文字间距
      const x = (index + 1) * textSpace + fontWidth * index // x方向坐标
      const y = randomNum(22, height) // y方向坐标
      const deg = randomNum(-40, 40) // 旋转角度
      const textIdx = randomNum(0, letters.length)
      const letter = letters[textIdx]
      ctx.textBaseline = 'alphabetic'
      ctx.font = `${fontSize}px Simhei`
      ctx.fillStyle = randomColor(60, 150)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(letter, 0, 0)
      ctx.restore()
      code += letter
    }
  
    change(code)
  }
  
  // 绘制线
  const drawLine = (): void => {
    for (let index = 0; index < LINES; index++) {
      const x1 = randomNum(0, ctx.canvas.clientWidth)
      const y1 = randomNum(0, ctx.canvas.clientHeight)
      const x2 = randomNum(0, ctx.canvas.clientWidth)
      const y2 = randomNum(0, ctx.canvas.clientHeight)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.lineWidth = 1
      ctx.strokeStyle = randomColor(150, 250)
      ctx.stroke()
    }
  }
  
  // 绘制点
  const drawDot = (): void => {
    for (let index = 0; index < DOTS; index++) {
      const x = randomNum(0, ctx.canvas.clientWidth)
      const y = randomNum(0, ctx.canvas.clientHeight)
      const r = randomNum(1, 2)
      ctx.beginPath()
      ctx.arc(x, y, r, 0, 2 * Math.PI)
      ctx.fillStyle = randomColor(100, 200)
      ctx.fill()
    }
  }

  const canvasStyle = {
    width,
    height,
    border: '1px solid #d9d9d9',
  }

  return (
    <div style={canvasStyle}>
      <canvas onClick={handleClick} ref={verifyCodeRef} width={width - 2} height={height - 2}></canvas>
    </div>
  )
  
}

export default VerifyCode