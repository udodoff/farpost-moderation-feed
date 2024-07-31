const mockBrief = {
    id: 445385,
    advertLink:
        'https://www.farpost.ru/vladivostok/tech/communication/cellphones/iphone-15-pro-128gb-rassrochka-trade-in-garantija-1-god-116360874.html',
    publishDate: 1234567,
    publishDateString: '08:46, сегодня',
    ownerId: 1234567,
    ownerLogin: 'CoolUser',
    ownerLink: 'https://www.farpost.ru/company/TehnoSet/',
    bulletinSubject: 'Заголовок объявления',
    bulletinText:
        'В связи с расширением отдела мы ищем сотрудника в нашу большую команду #ФАРПОСТВСЕСВОИЕсли ты общительный и любознательный, мечтаешь построить карьеру, найти друзей и изменить мир к лучшему, то нам по пути.\nТы будешь:\n- принимать входящие звонки от пользователей сайтов FarPost.ru, VL.ru, Drom.ru;\n- помогать пользователям решать самые разные задачи и находить выход из нестандартных ситуаций.Никаких продаж и «холодных» звонков!\n\nЮность и отсутствие опыта - не помеха. Наша команда и специалист по обучению помогут тебе стать крутым профи в общении с клиентами. Обучение будет состоять из нескольких этапов теории и практики. При этом ты будешь официально оформлен уже с первого рабочего дня.',
    bulletinImages: ['https://static.baza.farpost.ru/v/1510541224458_hugeBlock'],
};

export const mockBriefList = Array.from({ length: 10 }, (_, k) => {
    return k % 3 !== 0
        ? { ...mockBrief, id: Math.ceil(Math.random() * 10000000) }
        : {
              ...mockBrief,
              id: Math.ceil(Math.random() * 10000000),
              bulletinImages: [
                  'https://static.baza.farpost.ru/v/1510541224458_hugeBlock',
                  'https://static.baza.farpost.ru/v/1510541224458_hugeBlock',
              ],
          };
});
