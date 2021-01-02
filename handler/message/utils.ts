/* eslint-disable */ 
let votingCounts = 0;

export const toMention = function (a) {
    if (typeof a === 'string') {
        return '@' + a.replace('@c.us', '')
    }
}

export const isAdmin = function(number, admins){
    return admins.includes(number);
}

export const getTitle = function(number, admins){
    return isAdmin(number, admins)? 'admin' : 'membro comum';
}

export const getMentionWithTitle = function(number, admins){
    let title = isAdmin(number, admins)? 'admin' : 'membro comum';
    return `${getTitle(number, admins)} ${toMention(number)}`;
}

export const random = (min, max) => Math.floor(Math.random()*max+min);

export const getId = function() {
    let result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (let i = 0; i < 4; i++){
        result.push([]);
        for (var j = 0; j < 4; j++ ) {
            result[result.length - 1].push(
                characters.charAt(Math.floor(Math.random() * charactersLength))
            )
        }
        result[result.length - 1] = result[result.length - 1].join('')
    }
    return result.join('-');
}

export const createVoting = function(votingMap, target, members, from){
    if (votingMap[target]){
        let voting = votingMap[target];
        throw new Error(`Já há um votekick nesse membro. Votação:\n\nID: ${voting.id}\nBanir: ${voting.shouldKick}/${voting.votesNeeded}\nNão banir: ${voting.shouldKeep}/${voting.votesNeeded}`);
    }

    let votesNeeded = Math.floor( (members.length/2)+1 );

    votingMap[target] = {
        id: ++votingCounts,
        target,
        shouldKick: 1,
        shouldKeep: 0,
        done: false,
        votes: [from],
        votesNeeded: 5,
        //votesNeeded,
    };

    return votingMap[target];
};

export const doVote = function(voting, from, kick=true){
    if (voting.votes.includes(from)){
        throw new Error('Você já votou.');
    }

    voting.votes.push(from);

    if (kick) voting.shouldKick += 1;
    else voting.shouldKeep += 1;

    if (voting.shouldKick >= voting.votesNeeded){
        voting.kicked = true;
        voting.done = true;
    } else if (voting.shouldKeep >= voting.votesNeeded){
        voting.kicked = false;
        voting.done = true;
    } 
};

export const getVote = function(arg){
    let vote = arg.trim().toLowerCase();

    let shouldKickValidVotes = ['s', 'y', 'ss', 'sss', 'sim', 'yes', '👍', '👍🏿', '👍🏻', '👍🏽', '👍🏾', '👍🏼'],
        shouldNotKickValidVotes = ['n', 'n', 'nn', 'no', 'nnn', 'nao', 'não', 'nem', 'ñ', '👎','👎🏻','👎🏼','👎🏽','👎🏾','👎🏿'];

    if (shouldKickValidVotes.includes(vote)){
        return true;
    }

    if (shouldNotKickValidVotes.includes(vote)){
        return false;
    }

    throw new Error('Voto inválido.');
};