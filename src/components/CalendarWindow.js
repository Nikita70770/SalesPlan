import Calendar from 'react-calendar';

export default function CalendarWindow(props) {
    const { stateCalendar, setStateCalendar, date, setDate } = props;

    function onClickCloseWindow() {
        setStateCalendar(!stateCalendar);
    }

    return stateCalendar ? (
        <div className="calendar_window">
            <div className="calendar_header">
                <button className="btn_close_calendar" onClick={onClickCloseWindow}>
                    <img src="/img/cancel_bl.svg" alt="" />
                </button>
            </div>
            <div className="calendar_content">
                <Calendar value={date} onChange={setDate} />
            </div>
        </div>
    ) : null;
}
