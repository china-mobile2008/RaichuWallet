/* global alert */
import React, { Component } from 'react';
import { ScrollView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    BlueLoading,
    BlueButton,
    SafeBlueArea,
    BlueCard,
    BlueText,
    BlueHeader,
} from '../BlueComponents';
import PropTypes from 'prop-types';
import Prompt from 'react-native-input-prompt'
/** @type {AppStorage} */
let BlueApp = require('../BlueApp');
let prompt = require('../prompt');
let EV = require('../events');
let loc = require('../loc');

export default class PlausibleDeniability extends Component {
    static navigationOptions = {
        tabBarLabel: loc.plausibledeniability.title,
        tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
                name={focused ? 'ios-settings' : 'ios-settings-outline'}
                size={26}
                style={{ color: tintColor }}
            />
        ),
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    async componentDidMount() {
        this.setState({
            isLoading: false,
        });
    }

    render() {
        if (this.state.isLoading) {
            return <BlueLoading />;
        }

        return (
            <SafeBlueArea forceInset={{ horizontal: 'always' }} style={{ flex: 1 }}>
                <BlueHeader
                    backgroundColor={BlueApp.settings.brandingColor}
                    centerComponent={{
                        text: loc.plausibledeniability.title,
                        style: { color: BlueApp.settings.foregroundColor, fontSize: 23 },
                    }}
                />

                <BlueCard>
                    <ScrollView maxHeight={450}>
                        <BlueText>{loc.plausibledeniability.help}</BlueText>

                        <BlueText />

                        <BlueText>{loc.plausibledeniability.help2}</BlueText>

                        <BlueButton
                            icon={{ name: 'shield', type: 'octicon' }}
                            title={loc.plausibledeniability.create_fake_storage}
                            onPress={async () => {
                                let p1
                                if (Platform.OS === 'ios') {
                                    p1 = await prompt(
                                        loc.plausibledeniability.create_password,
                                        loc.plausibledeniability.create_password_explanation,
                                    );
                                } else {
                                    // p1 = await prompt(
                                    //     loc.plausibledeniability.create_password,
                                    //     loc.plausibledeniability.create_password_explanation,
                                    // );
                                }
                                if (p1 === BlueApp.cachedPassword) {
                                    return alert(
                                        loc.plausibledeniability.password_should_not_match,
                                    );
                                }

                                if (!p1) {
                                    return;
                                }

                                let p2 = await prompt(loc.plausibledeniability.retype_password);
                                if (p1 !== p2) {
                                    return alert(loc.plausibledeniability.passwords_do_not_match);
                                }

                                await BlueApp.createFakeStorage(p1);
                                EV(EV.enum.WALLETS_COUNT_CHANGED);
                                EV(EV.enum.TRANSACTIONS_COUNT_CHANGED);
                                alert(loc.plausibledeniability.success);
                                this.props.navigation.navigate('Wallets');
                            }}
                        />

                        <BlueButton
                            icon={{ name: 'arrow-left', type: 'octicon' }}
                            title={loc.plausibledeniability.go_back}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                        />
                    </ScrollView>
                </BlueCard>
            </SafeBlueArea>
        );
    }
}

PlausibleDeniability.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func,
        goBack: PropTypes.func,
    }),
};
