import sys

import logging

import graypy

from suai_project.config.Config import CONFIG

if CONFIG.logging.graylog.enabled:
    if CONFIG.logging.graylog.udp:
        graylog_handler = graypy.GELFUDPHandler(CONFIG.logging.graylog.host, CONFIG.logging.graylog.port)
    else:
        graylog_handler = graypy.GELFTCPHandler(CONFIG.logging.graylog.host, CONFIG.logging.graylog.port)

    graylog_handler.setFormatter(logging.Formatter(
        "[%(name)s]: %(message)s"
    ))
else:
    graylog_handler = None

if CONFIG.logging.console.enabled:
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(
        "%(asctime)s [%(name)s] %(levelname)s: %(message)s"
    ))
else:
    console_handler = None

logging.getLogger().setLevel(logging.getLevelName(CONFIG.logging.root_level))
for log, level in CONFIG.logging.levels.items():
    logging.getLogger(log).setLevel(logging.getLevelName(level))


def get_logger(name) -> logging:
    logger = logging.getLogger(name)

    # logger.propagate = False  # Global logger should not print messages again.

    # Avoiding log duplicates: do not add handlers again to already initialized logger
    # https://stackoverflow.com/questions/7173033/duplicate-log-output-when-using-python-logging-module
    if len(logger.handlers) != 0:
        return logger

    if console_handler:
        logger.addHandler(console_handler)

    if graylog_handler:
        logger.addHandler(graylog_handler)

    return logger

def get_logger_univorn():
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "handlers": {
            "console": {
                "()": lambda: console_handler,
            },
            "graylog": {
                "()": lambda: None,
            }
        },
        "root": {
            "level": "INFO",
            "handlers": ["console", "graylog"],
        },
    }
    return logging_config
