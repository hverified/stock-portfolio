from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services.scrape_service import fetch_stock_data
from app.services.trade_service import execute_trade
import logging

scheduler = AsyncIOScheduler()


async def schedule_async_task(task_func, *args):
    try:
        await task_func(*args)
    except Exception as e:
        logging.error(f"Error in scheduled task: {e}")


def setup_scheduled_tasks(scheduler):
    fetch_stock_trigger = CronTrigger(
        second=30, minute=39, hour=20, day="*", month="*", day_of_week="0-4"
    )
    buy_trigger = CronTrigger(
        second=00, minute=43, hour=11, day="*", month="*", day_of_week="0-4"
    )
    sell_trigger = CronTrigger(
        second=55, minute=15, hour=9, day="*", month="*", day_of_week="0-4"
    )

    scheduler.add_job(schedule_async_task, fetch_stock_trigger, args=[fetch_stock_data])
    # scheduler.add_job(schedule_async_task, buy_trigger, args=[execute_trade, "buy"])
    # scheduler.add_job(schedule_async_task, sell_trigger, args=[execute_trade, "sell"])
