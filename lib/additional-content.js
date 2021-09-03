export function freeze (o) { return o };

export async function sendReplyWithMentions (chatId, body, quotedMsg) {
    return await window.WAPI.reply(chatId, body, quotedMsg, true)
}

export async function newReply (_0x14613c, _0x53f7e0, _0x86991e, tag = false) {
    const _0x2e6167 = _0x52d513
    if (_0x544071[_0x2e6167(0x104c, 'n!Uc') + 'wq'](!0x1, window['get' + 'Con' + _0x2e6167(0x1614, '3^Nm') + 't'])) { return !0x1 }
    const _0x1b37e4 = Store[_0x2e6167(0x19eb, 'cZIo') + 't'][_0x2e6167(0x1721, 'hl*e')](_0x14613c)
    if (!_0x86991e) { return _0x544071['iND' + 'Xz'] }
    if (_0x544071[_0x2e6167(0x1a65, 'F4^1') + 'FK'](_0x544071[_0x2e6167(0x156c, 'cZIo') + 'cT'], typeof _0x86991e) && WAPI['get' + _0x2e6167(0x151e, 'K8#G') + _0x2e6167(0x1a46, 'z$%v') + _0x2e6167(0x1925, 'vnX5') + _0x2e6167(0x118e, 'F4^1') + 'ssa' + _0x2e6167(0x91e, 'PmIc') + 'd'](_0x86991e) && (_0x86991e = await Store['Cha' + 't'][_0x2e6167(0x2f1, 'v!A7')](WAPI[_0x2e6167(0x137d, 'PmIc') + _0x2e6167(0x7fb, 'wUwS') + 'tId' + _0x2e6167(0x4e7, 'W^^X') + _0x2e6167(0x177c, '13n$') + 'ssa' + _0x2e6167(0x3ea, '^7Xf') + 'd'](_0x86991e))[_0x2e6167(0x7f9, 'musC') + 's'][_0x2e6167(0xc62, 'n!Uc') + 'd'](_0x86991e)),
    !_0x86991e) { return _0x544071[_0x2e6167(0xd33, 'F4^1') + 'zC'] }
    if (!_0x1b37e4) { return _0x544071[_0x2e6167(0x199b, 'F#4r') + 'jB'] }
    let _0x421ab5 = {}
    _0x86991e && (_0x421ab5 = {
        quotedParticipant: _0x86991e[_0x2e6167(0x93e, '3^Nm') + 'hor'] || _0x86991e[_0x2e6167(0xc3e, '(4WV') + 'm'],
        quotedStanzaID: _0x86991e.id.id
    })
    if (!Store[_0x2e6167(0xb01, 'rNYG')]['mod' + 'els'][_0x2e6167(0x13a6, 'R[@Z') + _0x2e6167(0xb56, 'fD2!')](_0x2bb9f7 => _0x2bb9f7['__x' + _0x2e6167(0x1428, 'oiTE') + 'Sen' + _0x2e6167(0xedd, '5F!C') + 'Me'] && !_0x2bb9f7[_0x2e6167(0xeff, 'F4^1') + _0x2e6167(0x106d, 'n!Uc') + _0x2e6167(0x1785, 'K8#G')] && _0x2e6167(0x12dc, '!*c7') + 't' === _0x2bb9f7[_0x2e6167(0x674, 'fD2!') + 'e'])[0x0]) { return _0x544071[_0x2e6167(0x4c9, '!*c7') + 'dv'] }
    const _0x472043 = Object[_0x2e6167(0x106e, 'UtJG') + _0x2e6167(0xbf7, 'kQbj')]({})
    const _0x55247a = window[_0x2e6167(0xea8, 'M5V5') + 'I'][_0x2e6167(0x12ff, 'z$%v') + _0x2e6167(0x16a6, '3^Nm') + _0x2e6167(0x1aed, '[H!3') + 'sag' + _0x2e6167(0x803, 'v!A7')](_0x14613c)
    _0x55247a[_0x2e6167(0xaa6, 'xmd6') + 'tic' + _0x2e6167(0xf70, '[H!3') + 'nt'] && delete _0x55247a[_0x2e6167(0x11c0, 'cZIo') + _0x2e6167(0x192f, 'fD2!') + 'ipa' + 'nt'],
    _0x544071[_0x2e6167(0x4a3, '%n1b') + 'aD'](null, _0x86991e[_0x2e6167(0x9db, '2jqE') + 'tio' + 'n']) && (_0x86991e['cap' + _0x2e6167(0x1843, '(4WV') + 'n'] = void 0x0)
    const _0xe9ba6a = {
        ack: 0x0,
        id: _0x55247a,
        local: !0x0,
        from: Store.Me[_0x2e6167(0x12f0, 'K8#G')],
        self: _0x544071[_0x2e6167(0x434, 'RTjC') + 'rV'],
        t: _0x544071[_0x2e6167(0x1195, '5F!C') + 'cW'](parseInt, new Date()['get' + _0x2e6167(0x11b8, 'DL(S') + 'e']() / 0x3e8),
        to: new Store['Wid' + (_0x2e6167(0x38f, 'nI[&')) + 'tor' + 'y']['cre' + (_0x2e6167(0xaf8, '[H!3')) + (_0x2e6167(0xf77, 'uU#^'))](_0x14613c),
        isNewMsg: !0x0,
        type: _0x544071[_0x2e6167(0xdb9, 'zXbd') + 'zm'],
        quotedMsg: _0x86991e,
        body: _0x53f7e0,
        ..._0x421ab5
    }
    if (tag) {
        let mentionedJidList
        try {
            mentionedJidList = body.match(/@(\d*)/g).filter(x => x.length > 5).map(x => Store.Contact.get(x.replace('@', '') + '@c.us') ? new Store.WidFactory.createUserWid(x.replace('@', '')) : '') || undefined
        } catch (e) {
            mentionedJidList = undefined
        }
        _0xe9ba6a.mentionedJidList = mentionedJidList
    }
    Object['ass' + _0x2e6167(0xdae, 'dCiw')](_0x472043, _0xe9ba6a)
    const _0x29ffd6 = await Promise[_0x2e6167(0x98a, 'z$%v')](Store['add' + _0x2e6167(0x1b13, 'UtJG') + _0x2e6167(0x9d0, '6y@(') + _0x2e6167(0x1329, 'R[@Z') + _0x2e6167(0x183a, 'DL(S') + _0x2e6167(0x137f, '[(cC') + 't'](_0x1b37e4, _0xe9ba6a))
    return _0x544071['HkS' + 'Qc']('OK', _0x29ffd6[0x1]) ? _0x55247a[_0x2e6167(0xc2d, 'xmd6') + 'ria' + _0x2e6167(0xb9c, 'hl*e') + 'ed'] : _0x2e6167(0x988, '5F!C') + _0x2e6167(0x7b1, '%n1b') + _0x2e6167(0x279, '!*c7') + _0x2e6167(0xe69, 'kQbj') + 'hin' + 'g\x20w' + _0x2e6167(0x7c4, 'kQbj') + '\x20wr' + 'ong' + '\x20wh' + _0x2e6167(0x132f, 'n!Uc') + '\x20tr' + _0x2e6167(0xe80, 'oiTE') + _0x2e6167(0x1903, '@Akv') + _0x2e6167(0xb51, 'F4^1') + 'end' + _0x2e6167(0xa01, 'DL(S') + _0x2e6167(0x1409, 'z$%v') + _0x2e6167(0x2b8, '(4WV') + _0x2e6167(0x174d, '@Akv') + ':\x20' + _0x29ffd6[0x1]
}
