/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        NotificationProvider
 * CVM-Role:        Service Provider
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 *
 * Description:     Provides notification functionality to the whole application.
 *
 * END HEADER
 */

import {
  nativeImage,
  Notification
} from 'electron'
import path from 'path'
import ProviderContract from './provider-contract'

export default class NotificationProvider extends ProviderContract {
  private readonly _osSupportsNotification: boolean
  private readonly _icon: Electron.NativeImage
  private readonly _logger: LogProvider

  constructor (logger: LogProvider) {
    super()
    this._logger = logger
    this._logger.verbose('Notification provider booting up ...')
    this._osSupportsNotification = Notification.isSupported()
    this._icon = nativeImage.createFromPath(path.join(__dirname, '../../common/img/image-preview.png'))
    // Inject the global notification methods so that everyone has an easy time
    // broadcasting those messages to all windows involved.
  }

  async boot (): Promise<void> {
    // Nothing to do
  }

  show (msg: string, title?: string, callback?: Function): boolean {
    if (!this._osSupportsNotification) {
      return false
    }

    const notification = new Notification({
      title: title ?? 'Zettlr',
      body: msg,
      silent: true,
      icon: this._icon,
      hasReply: false, // macOS only
      timeoutType: 'default', // Windows/Linux only
      urgency: 'low', // Linux only, we don't want to distract too much
      closeButtonText: '' // macOS only, empty means to use localized text
    })

    // Now show the notification
    notification.show()

    if (callback !== undefined) {
      notification.on('click', (event) => {
        callback()
      })
    }

    return true
  }

  /**
   * Shut down the provider
   *
   * @return  {Promise<boolean>}  Always resolves to true
   */
  async shutdown (): Promise<void> {
    this._logger.verbose('Notification provider shutting down ...')
  }
}
