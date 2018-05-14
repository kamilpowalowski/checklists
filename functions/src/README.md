Before deploy, set enviroment variables:
```bash
firebase functions:config:set domain.host="lizt.co" domain.protocol="https"
firebase functions:config:set bot.token="telegram_bot_token" bot.chat="chat_id"
firebase functions:config:set secret.token="secret_token"
```

To change project:
```bash
firebase use development|production
```

To test this locally:
```bash
npm --prefix functions run build
firebase serve --only hosting,functions
```
or
```bash
firebase functions:config:get > .runtimeconfig.json
firebase functions:shell
```
