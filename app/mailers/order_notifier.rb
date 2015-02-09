# encoding: utf-8
class OrderNotifier < Notifier
  default from: "BSC <ordersystem@bsc-ltd.com>"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.order_notifier.received.subject
  #

  # Заказ получен
  def received(order)
    @order = order
    mail(to: order.email, subject: 'Интернет-магазин БСК. Ваш заказ №' + @order.id.to_s + ' принят', skip_premailer: false)
  end

  # Заказ оплачен
  def paid(order)
    @order = order
    mail(to: order.email, subject: 'Интернет-мазанин БСК. Ваш заказ №' + @order.id.to_s + ' успешно оплачен', skip_premailer: false)
  end

  # Заказ ждет отправку
  def waiting_to_be_sent(order)
    @order = order
    mail(to: order.email, subject: 'Интернет-мазанин БСК. Ваш заказ №' + @order.id.to_s + ' готов к отправке', skip_premailer: false)
  end

  # Заказ доставлен
  def delivered(order)
    @order = order
    mail(to: order.email, subject: 'Интернет-мазанин БСК. Ваш заказ №' + @order.id.to_s + ' доставлен', skip_premailer: false)
  end

  # Заказ отменен
  def canceled(order)
    @order = order
    mail(to: order.email, subject: 'Интернет-мазанин БСК. Ваш заказ №' + @order.id.to_s + ' отменен', skip_premailer: false)
  end

  def report(order)
    @order = order
    mail to: 'order@bsc-ltd.ru', subject: 'Новый заказ с сайта №' + @order.id.to_s
  end

  def report_paid(order)
    @order = order
    mail to: 'order@bsc-ltd.ru', subject: 'Заказ №' + @order.id.to_s + ' оплачен'
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
