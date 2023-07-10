class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlistDetail = await this._playlistsService.getPlaylistById(playlistId);
      const result = await this._mailSender.sendEmail(targetEmail, playlistDetail);

      console.log(`email send to ${targetEmail} successfully`);
      console.log(result);
      console.log(playlistDetail);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
