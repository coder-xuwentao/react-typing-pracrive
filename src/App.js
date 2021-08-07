import "./App.css";
import React from "react";
import { wordData } from "./wordData.js";

// 单词弹幕
class WordBullet extends React.Component {
    render() {
        const bltStyle = Object.assign({}, this.props.style, {
            top: Math.random() * 700 + "px",
        });

        return (
            <div className="word-bullet" style={bltStyle}>
                {this.props.text}
            </div>
        );
    }
}

class Aside extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            duration: 0,
            slidePeriod:0
        };
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                duration: this.state.duration + 1,
            });
        }, 1000);
    }
    get rateRight() {
        const result = this.props.result;
        if (result.numError + result.numRight === 0) {
            return 0;
        }
        let rateRight = result.numRight / (result.numError + result.numRight);
        return parseInt(rateRight * 100);
    }
    get speed() {
        const numRight = this.props.result.numRight;
        if (numRight === 0) {
            return 0;
        }
        return ((numRight / this.state.duration) * 60).toFixed(2);
    }

    
    handleInputChange(e) {
        this.setState({
            slidePeriod: e.target.value,
        });
    }

    render() {
        return (
            <div className="aside">
                <div className="label">刷新周期(1-30)</div>
                <div>
                    <input type="text"  onChange={this.handleInputChange} />
                    <button onClick={()=>this.props.onClick(this.state.slidePeriod)}>保存</button>
                </div>
                <div className="label">正确数</div>
                <div className="result">{this.props.result.numRight}</div>
                <div className="label">错误数</div>
                <div className="result">{this.props.result.numError}</div>
                <div className="label">正确率</div>
                <div className="result">{this.rateRight}%</div>
                <div className="label">时间</div>
                <div className="result">{this.state.duration}s</div>
                <div className="label">速度</div>
                <div className="result">{this.speed}单词/min</div>
                <div className="label">------</div>
                <button onClick={()=>this.props.onEndClick({rateRight:this.rateRight,speed:this.speed,duration:this.state.duration})}>结束</button>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        // 一周期时长
        this.state = {
            listBullet: [],
            listBulletId: 0,
            delId: 0,
            period: 12,
            delBulletId: 0,
            // 输入内容
            inputValue: "",
            // 提示
            hint: "",
            result: {
                numRight: 0,
                numError: 0,
            },
        };

        this.addNumBullet = this.addNumBullet.bind(this);
        this.onKeyup = this.onKeyup.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSaveFrequency = this.handleSaveFrequency.bind(this);
        this.handleEndClick = this.handleEndClick.bind(this);
    }

    get styleBullet() {
        return { animation: this.state.period + "s move-left linear forwards" };
    }

    componentDidMount() {
        this.addNumBullet();
        this.timerID_1 = setInterval(
            () => this.addNumBullet(),
            this.state.period * 200
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID_1);
    }

    // 添加弹幕组件
    addNumBullet() {
        const text = wordData[Math.floor(Math.random() * wordData.length)];
        const listBulletId = this.state.listBulletId;

        setTimeout(() => this.delNumBullet(), this.state.period * 1000);

        this.setState({
            listBullet: [
                ...this.state.listBullet,
                <WordBullet
                    style={this.styleBullet}
                    text={text}
                    key={listBulletId}
                />,
            ],
            listBulletId: listBulletId + 1,
        });
    }

    // 删除弹幕组件
    delNumBullet() {
        const delId = this.state.delId;
        const listBullet = this.state.listBullet;
        let result = this.state.result;

        let index;
        for (let i = 0; i < listBullet.length; i++) {
            if (Number(listBullet[i].key) === delId) {
                index = i;
                break;
            }
        }
        if (index === 0 || index) {
            listBullet.splice(index, 1);
            result = Object.assign(result, {
                numError: result.numError + 1,
            });

            this.setState({
                listBullet,
                hint: "错过",
                result,
            });
        } else {
        }
        this.setState({
            delId: delId + 1,
        });

        // console.log(this.state.listBullet);
    }
    // 回车
    onKeyup(e) {
        if (e.keyCode === 13) {
            const inputValue = this.state.inputValue;
            let index;
            const listBullet = this.state.listBullet;
            let result = this.state.result;

            listBullet.forEach((o, i) => {});

            for (let i = 0; i < listBullet.length; i++) {
                if (listBullet[i].props.text === inputValue) {
                    index = i;
                    break;
                }
            }

            if (index === 0 || index) {
                listBullet.splice(index, 1);
                result = Object.assign(result, {
                    numRight: result.numRight + 1,
                });
                this.setState({
                    listBullet,
                    hint: "匹配成功",
                    result,
                });
            } else {
                result = Object.assign(result, {
                    numError: result.numError + 1,
                });
                this.setState({
                    hint: "没有这个单词",
                    result,
                });
            }
            this.setState({
                inputValue: "",
            });
        }
    }

    // 绑定input
    handleInputChange(e) {
        if (this.state.hint) {
            this.setState({
                hint: "",
            });
        }
        this.setState({
            inputValue: e.target.value,
        });
    }

    // 设置频率
    handleSaveFrequency(period){

        clearInterval(this.timerID_1);
        console.log(period * 500);

        this.timerID_1 = setInterval(
            () => this.addNumBullet(),
            period * 200
        );
        console.log(this.timerID_1);

        this.setState({
            period: period,
        });
    }

    handleEndClick(endInfo){
        let info = Object.assign({},this.state.result,endInfo)
        document.write(`正确：${info.numRight}个<br/>错误：${info.numError}个<br/>正确比例：${info.rateRight}%<br/>速度：${info.speed}个/min<br/>持续时间：${info.duration}秒<br/><br/>`)
        document.write("<button onclick='window.location.reload()'>重新开始</button>")
    }

    render() {
        return (
            <div className="App">
                <div className="container">
                    <div className="content">
                        <div className="list-bullet">
                            {this.state.listBullet}
                        </div>
                        <div className="input-box">
                            <div className="hint">{this.state.hint}</div>
                            <input
                                type="text"
                                value={this.state.inputValue}
                                onKeyUp={this.onKeyup}
                                onChange={this.handleInputChange}
                            />
                        </div>
                    </div>
                    <Aside
                        result={this.state.result}
                        onClick={this.handleSaveFrequency}
                        onEndClick={this.handleEndClick}
                    />
                </div>
            </div>
        );
    }
}

export default App;
