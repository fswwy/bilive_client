import tools from './lib/tools'
import Client from './lib/client'
import Options from './options'
/**
 * 客户端, 可自动重连
 *
 * @class ClientRE
 * @extends {Client}
 */
class ClientRE extends Client {
  /**
   * Creates an instance of ClientRE.
   * @param {string} server
   * @param {string} protocol
   * @memberof Client
   */
  constructor(server: string, protocol: string) {
    super(server, protocol)
    this.on('clientError', error => tools.ErrorLog(error))
    this.on('close', () => this._ClientReConnect())
  }
  /**
   * 重连次数, 以五次为阈值
   *
   * @type {number}
   * @memberof ClientRE
   */
  public reConnectTime: number = 0
  /**
   * 重新连接
   *
   * @private
   * @memberof ClientRE
   */
  private _ClientReConnect() {
    setTimeout(() => {
      if (this.reConnectTime >= 5) {
        this.reConnectTime = 0
        this._DelayReConnect()
      }
      else {
        this.reConnectTime++
        const { 0: server, 1: protocol } = Options._.config.serverURL.split('#')
        if (protocol !== undefined && protocol !== '') {
          this._server = server
          this._protocol = protocol
          this.Connect()
        }
      }
    }, 10 * 1000)
  }
  /**
   * 5分钟后重新连接
   *
   * @private
   * @memberof ClientRE
   */
  private _DelayReConnect() {
    setTimeout(() => this.Connect(), 5 * 60 * 1000)
    tools.ErrorLog('尝试重连服务器失败，五分钟后再次重新连接')
  }
}
export default ClientRE