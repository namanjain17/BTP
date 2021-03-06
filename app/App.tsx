import 'react-native-gesture-handler'

import React, { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-community/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { LocationComponent, LoginComponent, PaymentComponent, SignupComponent } from './src'

type Routes = {
	Login: undefined
	Location: undefined
	Payment: undefined
	Signup: undefined
}

const Stack = createStackNavigator<Routes>()

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

	useEffect(() => {
		AsyncStorage.getItem('isLoggedIn').then((value) => {
			if (value !== null) {
				setIsLoggedIn(JSON.parse(value))
			}
		})
	})

	return (
		<NavigationContainer>
			<StatusBar barStyle="dark-content" />
			<SafeAreaProvider>
				<Stack.Navigator initialRouteName={isLoggedIn ? 'Location' : 'Login'} headerMode="none">
					<Stack.Screen name="Login" component={LoginComponent} />
					<Stack.Screen name="Signup" component={SignupComponent} />
					<Stack.Screen name="Location" component={LocationComponent} />
					<Stack.Screen name="Payment" component={PaymentComponent} />
				</Stack.Navigator>
			</SafeAreaProvider>
		</NavigationContainer>
	)
}

export default App
