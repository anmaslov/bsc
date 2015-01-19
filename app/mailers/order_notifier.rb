# encoding: utf-8
class OrderNotifier < Notifier
  default from: "BSC <ordersystem@bsc-ltd.com>"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.order_notifier.received.subject
  #
  def received(order)
    @order = order


    mail(to: order.email, subject: 'Подтверждение заказа в BSC').deliver

  end

  def report(order)
    @order = order
    mail to: 'pavel.osetrov@me.com', subject: 'Новый заказ с сайта BSC'
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.order_notifier.shipped.subject
  #
  def shipped(order)
    @order = order

    mail to: order.email, subject: 'Заказ из BSC отправлен'
  end
end
