# IOT_frontend_mobile



**Lancer le projet**

Après avoir clone le projet, il vous faut premièrement le construire avec 

```
npm install
```

 Ensuite vous pouvez le lancer en mode développement avec la commande

```
react-native run-android
```

*Note : Le projet a été testé avec Android, il n'a malheureusement pas pu être expérimenté sur iOS et il n'est pas certain qu'il soit opérationnel sur cette plateforme à cause des spécificités de la librairie react-native-nfc-manager.*

## **Application**

L'application comporte différents menus

##### Accueil

Cette fenêtre indique si l'utilisateur possède un smartphone qui est compatible avec NFC.

Pour Android :

- La fenêtres indique si NFC est activé sur le smartphone
- La fenêtre propose un lien pour accéder aux réglages d'NFC sur le smartphone, ce qui permetterait d'activer NFC si cela n'est pas le cas.

**Noeuds Lora**

Cette fenêtre affiche les noeuds Lora engeristés sur le back-end TTN.



Menu :

* Show nodes
  * Video nodes
  * Lora nodes
* Add node
* Settings
* Disconnect


The login and registration page were inspired by: [https://github.com/dwicao/react-native-login-screen](https://github.com/dwicao/react-native-login-screen).

Server icon on login screen comes from Font Awesome ([https://fontawesome.com/icons/server?style=solid](https://fontawesome.com/icons/server?style=solid))