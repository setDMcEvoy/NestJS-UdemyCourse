describe('my test', () => {
    it('returns true', () => {
        expect(true).toEqual(true);
    });
});

class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        global.console.log(`${name} is now a friend!`);
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name);
        
        if (idx === -1) {
            throw new Error('Friend not found!');
        }
        this.friends.splice(idx, 1);
    }
}

describe('FriendsList', () => {
    let friendsList;

    beforeEach(() => {
        friendsList = new FriendsList();
    });

    it('Initializes friends list', () => {
        expect(friendsList.friends.length).toEqual(0);
    });

    it('Adds friend to list', () => {
        friendsList.addFriend('Daniel');
        expect(friendsList.friends.length).toEqual(1);
    });

    it('Adds friend to list and announces', () => {
        friendsList.announceFriendship = jest.fn(); // will keep track of calls

        expect(friendsList.announceFriendship).not.toHaveBeenCalled(); // has not been called.
        friendsList.addFriend('Daniel');
        expect(friendsList.announceFriendship).toHaveBeenCalledWith('Daniel');
    });

    describe('remove friend', () => {
        it('removes friend from list', () => {
            friendsList.addFriend('Dude');
            expect(friendsList.friends[0]).toEqual('Dude');
            friendsList.removeFriend('Dude');
            expect(friendsList.friends[0]).toBeUndefined();
        });

        it('throws error when friend DNE', () => {
            expect(() => friendsList.removeFriend('DudePerson')).toThrow(new Error('Friend not found!'));
        });
    });
});