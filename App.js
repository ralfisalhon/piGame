/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Alert, AlertIOS } from 'react-native';
import DefaultPreference from 'react-native-default-preference';

export default class App extends Component {
    constructor() {
        super();
        this.pi = "3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912983367336244065664308602139494639522473719070217986094370277053921717629317675238467481846766940513200056812714526356082778577134275778960917363717872146844090122495343014654958537105079227968925892354201995611212902196086403441815981362977477130996051870721134999999837297804995105973173281609631859502445945534690830264252230825334468503526193118817101000313783875288658753320838142061717766914730359825349042875546873115956286388235378759375195778185778053217122680661300192";
        this.state = {
            best: 0,
            onIndex: 0,
            currentDigit: 0,
            lastCorrect: true,
            showNumbers: false,
            canHighScore: true,
            mistakes: 0,
        }

        this.setBest();
    }

    async setBest() {
        const hiScore = await DefaultPreference.get('best');
        console.log(hiScore);

        this.setState({
            best: hiScore,
        })
    }

    async clickedNumber(number) {
        // DefaultPreference.set('best', '0');
        if (number == this.pi.substring(this.state.onIndex + 1, this.state.onIndex + 2)) {
            this.setState({
                onIndex: this.state.onIndex + 1,
                lastCorrect: true,
            })
            if (number != ".") {
                this.setState({
                    currentDigit: this.state.currentDigit + 1,
                })
            }
        } else if (number == "show") {
            this.setState({
                showNumbers: !this.state.showNumbers,
            })
            if (!this.state.showNumbers) {
                this.setState({
                    canHighScore: false,
                })
            }
        } else {
            this.setState({
                lastCorrect: false,
                mistakes: this.state.mistakes + 1,
            })

            if (this.state.mistakes >= 3) {
                this.setState({
                    canHighScore: false,
                })

                if (this.state.canHighScore && this.state.currentDigit > this.state.best) {
                    await this.setState({
                        best: this.state.currentDigit,
                    })

                    DefaultPreference.set('best', this.state.best.toString());
                }
            }
        }
    }



    jumpToDigit() {
        AlertIOS.prompt(
            'Enter digit',
            '',
            [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Jump',
                    onPress: (digit) => this.jump(digit),
                },
            ],
            'plain-text',
            '',
            'number-pad',
        );
    }

    jump(number) {
        number = parseInt(number);
        if (number >= this.pi.length) {
            Alert.alert("Digit is too big");
            return;
        }

        if (number == 0) {
            this.jumpTo0();
        } else {
            this.setState({
                onIndex: number + 1,
                currentDigit: number,
                lastCorrect: true,
                canHighScore: false,
            })
        }
    }

    jumpTo0() {
        this.setState({
            onIndex: 0,
            currentDigit: 0,
            lastCorrect: true,
            canHighScore: true,
            mistakes: 0,
            showNumbers: false,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle= "light-content" />
                <View style = {styles.display}>
                    <View style = {{alignItems: 'center'}}>
                        <TouchableOpacity style = {styles.jumpDigit} onPress={() => this.jumpToDigit()}>
                        <Text style = {styles.jumpText}>Jump to digit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.goTo0} onPress={() => this.jumpTo0()}>
                            <Text style = {styles.jumpText}>Go to 0</Text>
                        </TouchableOpacity>
                    </View>

                    <View style = {styles.textDisplay}>
                        <View style = {styles.smallerNumberView}>
                            <Text style = {styles.smallerNumber}>{this.pi.substring(this.state.onIndex - 2, this.state.onIndex - 1)}</Text>
                        </View>
                        <View style = {styles.smallNumberView}>
                            <Text style = {styles.smallNumber}>{this.pi.substring(this.state.onIndex - 1, this.state.onIndex)}</Text>
                        </View>
                        <View style = {styles.bigNumberView}>
                            <Text style = {this.state.lastCorrect ? styles.bigNumber : styles.bigNumberIncorrect}>{this.pi.substring(this.state.onIndex, this.state.onIndex + 1)}</Text>
                        </View>
                        <TouchableOpacity style = {styles.smallNumberView} onPress={() => this.clickedNumber("show")}>
                            <Text style = {styles.smallNumberQuestionGray}>{this.state.showNumbers ? this.pi.substring(this.state.onIndex + 1, this.state.onIndex + 2) : "?"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.smallerNumberView} onPress={() => this.clickedNumber("show")}>
                            <Text style = {styles.smallerNumberQuestionGray}>{this.state.showNumbers ? this.pi.substring(this.state.onIndex + 2, this.state.onIndex + 3) : "?"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style = {styles.infoDisplay}>
                        <View><Text style = {styles.infoText}>Current Digit: {this.state.currentDigit}</Text></View>
                        <View><Text style = {this.state.canHighScore ? styles.infoTextBest : styles.infoTextBestFalse}>Best: {this.state.best} Digits! ({this.state.mistakes})</Text></View>
                    </View>
                </View>

                <View style = {styles.keyPad}>
                    <View style = {styles.keyPadColumn}>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("7")}>
                        <Text style = {styles.text}>7</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("4")}>
                        <Text style = {styles.text}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("1")}>
                        <Text style = {styles.text}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("show")}>
                        <Text style = {styles.menuText}>{this.state.showNumbers ? "hide" : "show"}</Text>
                        </TouchableOpacity>
                    </View>
                        <View style = {styles.keyPadColumn}>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("8")}>
                        <Text style = {styles.text}>8</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("5")}>
                        <Text style = {styles.text}>5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("2")}>
                        <Text style = {styles.text}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("0")}>
                        <Text style = {styles.text}>0</Text>
                        </TouchableOpacity>
                    </View>
                        <View style = {styles.keyPadColumn}>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("9")}>
                        <Text style = {styles.text}>9</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("6")}>
                        <Text style = {styles.text}>6</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber("3")}>
                        <Text style = {styles.text}>3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.keyPadColumnRow} onPress={() => this.clickedNumber(".")}>
                        <Text style = {styles.text}>.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    display: {
        backgroundColor: 'black',
        flex: 1.3,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    keyPad: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 25,
        backgroundColor: 'black',
    },
    keyPadColumn: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#636e72',
    },
    keyPadColumnRow: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    jumpDigit: {
        backgroundColor: 'black',
        height: 30,
        width: 250,
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
    },
    goTo0: {
        backgroundColor: 'black',
        height: 30,
        width: 250,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
    },
    text: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    menuText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    jumpText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoText: {
        color: 'white',
        fontSize: 16,
    },
    infoTextBest: {
        color: 'green',
        fontSize: 16,
    },
    infoTextBestFalse: {
        color: 'red',
        fontSize: 16,
    },
    textDisplay: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 25,
    },
    infoDisplay: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 25,
    },
    bigNumberView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1.5,
        paddingHorizontal: 5,
    },
    bigNumber: {
        color: 'white',
        fontSize: 150,
        textAlign: 'center',
    },
    bigNumberIncorrect: {
        color: 'red',
        fontSize: 150,
        textAlign: 'center',
    },
    smallNumberView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    smallNumber: {
        color: 'orange',
        fontSize: 100,
        textAlign: 'center',
    },
    smallerNumberView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    smallerNumber: {
        color: 'orange',
        fontSize: 50,
        textAlign: 'center',
    },
    smallNumberQuestionGray: {
        color: 'gray',
        fontSize: 100,
        textAlign: 'center',
    },
    smallerNumberQuestionGray: {
        color: 'gray',
        fontSize: 50,
        textAlign: 'center',
    },
});
